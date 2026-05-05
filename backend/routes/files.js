import { Router } from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import { supabase } from '../supabase.js';
import { genai } from '../gemini.js';

const router = Router();

// ─── Multer setup ─────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    // Accept by extension OR by mimetype — Windows sometimes sends 'application/vnd.ms-excel'
    const ok =
      file.originalname.toLowerCase().endsWith('.csv') ||
      file.mimetype === 'text/csv' ||
      file.mimetype === 'text/plain' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/octet-stream';
    ok ? cb(null, true) : cb(new Error('Only CSV files are supported'));
  },
});

// Multer error handler — MUST be attached before the route logic
const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getServiceId() {
  // Try slug first, fall back to name — whichever your DB uses
  const { data, error } = await supabase
    .from('services')
    .select('id')
    .or('slug.eq.ai_data_scientist,name.eq.AI Data Scientist')
    .limit(1)
    .single();

  if (error || !data) throw new Error('ai_data_scientist service not found in DB');
  return data.id;
}

async function getOrCreateConversation(userId, serviceId, conversationId) {
  if (conversationId) return conversationId;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, service_id: serviceId, title: 'CSV Analysis' })
    .select('id')
    .single();

  if (error) throw new Error('Failed to create conversation: ' + error.message);
  return data.id;
}
function isValidStoragePath(path) {
  return typeof path === 'string' &&
         path.includes('/') &&
         path.endsWith('.csv');
}


// Retrieve the last uploaded file for this conversation from Supabase Storage
async function loadFileFromStorage(conversationId) {
  const { data: records } = await supabase
    .from('uploaded_files')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(5); // check last few files

  if (!records || records.length === 0) {
    console.warn("No DB records for conversation:", conversationId);
    return null;
  }

  for (const record of records) {
    console.log("Checking record:", record.storage_path);

    if (!isValidStoragePath(record.storage_path)) {
      console.warn("Skipping invalid storage_path:", record.storage_path);
      continue;
    }

    const { data: blob, error } = await supabase.storage
      .from('csv-files')
      .download(record.storage_path);

    if (error || !blob) {
      console.warn("Download failed for:", record.storage_path);
      continue;
    }

    return {
      buffer: Buffer.from(await blob.arrayBuffer()),
      originalname: record.filename,
      fromCache: true,
    };
  }

  console.error("No valid file found in storage");
  return null;
}

// Upload CSV buffer to Supabase Storage
async function uploadToStorage(userId, originalname, buffer) {
  const safeName = originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${userId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from('csv-files')
    .upload(storagePath, buffer, { contentType: 'text/csv', upsert: false });

  if (error) {
    console.warn('[storage] upload failed (non-fatal):', error.message);
    return null;
  }
  return storagePath;
}

// ─── POST /files/analyze ──────────────────────────────────────────────────────
router.post('/analyze', uploadMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    console.log('[DEBUG] content-type :', req.headers['content-type']);
    console.log('[DEBUG] req.file     :', req.file);
    console.log('[DEBUG] req.body     :', req.body);

    const { question, conversationId: incomingConvoId } = req.body;
    console.log("Fetching file for:", incomingConvoId);

    // ── 1. VALIDATE EARLY ────────────────────────────────────────────────────
    // If no file in this request, try to load the last one from storage
    let fileObj = req.file
      ? { buffer: req.file.buffer, originalname: req.file.originalname, fromCache: false }
      : null;

    if (!fileObj && incomingConvoId) {
      fileObj = await loadFileFromStorage(incomingConvoId);
    }

    if (!fileObj) {
      return res.status(400).json({
        error: '"Dataset not found. Please re-upload your CSV file."',
      });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // ── 2. CONVERSATION ──────────────────────────────────────────────────────
    const serviceId = await getServiceId();
    const activeConvoId = await getOrCreateConversation(userId, serviceId, incomingConvoId || null);

    // ── 3. STORE FILE IN SUPABASE (only when a new file was uploaded) ────────
    if (!fileObj.fromCache) {
      const storagePath = await uploadToStorage(userId, fileObj.originalname, fileObj.buffer);
       if (!storagePath) {
      throw new Error("Storage upload failed — aborting insert");
        }
      const fileRecord = {
        user_id:         userId,
        conversation_id: activeConvoId,
        filename:        fileObj.originalname,
        storage_path:    storagePath,
        status:          storagePath ? 'uploaded' : 'storage_failed',
      };

      // Include file_size only if the column exists in your schema.
      // Run in Supabase SQL editor to add it:
      //   ALTER TABLE uploaded_files ADD COLUMN IF NOT EXISTS file_size BIGINT;
      if (fileObj.buffer?.length !== undefined) {
        fileRecord.file_size = fileObj.buffer.length;
      }

      const { error: insertError } = await supabase.from('uploaded_files').insert(fileRecord);

      if (insertError) {
            console.error('[uploaded_files] insert FAILED:', insertError.message);
  throw new Error('Failed to save file metadata: ' + insertError.message);
      }
    }

    // ── 4. PARSE CSV ─────────────────────────────────────────────────────────
    const csvText = fileObj.buffer.toString('utf-8');
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parsed.errors.length > 0) {
      return res.status(400).json({ error: 'CSV parse error: ' + parsed.errors[0].message });
    }

    const rows = parsed.data;
    const columns = parsed.meta.fields || [];
    const rowCount = rows.length;

    // ── 5. BUILD STATS ───────────────────────────────────────────────────────
    const numericStats = {};
    columns.forEach((col) => {
      const vals = rows.map((r) => r[col]).filter((v) => typeof v === 'number' && !isNaN(v));
      if (vals.length > 0) {
        const sum = vals.reduce((a, b) => a + b, 0);
        numericStats[col] = {
          min: Math.min(...vals),
          max: Math.max(...vals),
          avg: +(sum / vals.length).toFixed(2),
          count: vals.length,
        };
      }
    });

    const sampleRows = rows.slice(0, 50);
    const dataSummary = `
Dataset: ${fileObj.originalname}
Rows: ${rowCount} | Columns: ${columns.length}
Columns: ${columns.join(', ')}

First ${sampleRows.length} rows (JSON):
${JSON.stringify(sampleRows, null, 2)}
    `.trim();

    // ── 6. PROMPT GEMINI ─────────────────────────────────────────────────────
    const prompt = `
You are a data analyst. You have been given a CSV dataset.

${dataSummary}

Numeric column statistics:
${JSON.stringify(numericStats, null, 2)}

User question: "${question.trim()}"

IMPORTANT: You must ONLY return valid JSON — no markdown, no backticks, no code blocks.

Return JSON in EXACTLY this format:

{
  "analysis": "Your plain-English explanation answering the question. Use \\n for line breaks.",
  "charts": [
    {
      "type": "bar",
      "title": "Chart title",
      "labels": ["label1", "label2"],
      "datasets": [{ "label": "Dataset name", "data": [1, 2, 3] }]
    }
  ],
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "suggestions": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
}

Rules:
- "charts" may be an empty array [] if no chart is appropriate
- Max 10 labels per chart for readability
- "insights" must always have 3 items
- "suggestions" must always have 3 follow-up questions
- NEVER include Python, pandas, or any code
`.trim();

    // Try models in order — fall back automatically on 503/429 (overload / rate-limit)
    const MODEL_FALLBACKS = [
      'gemini-3.1-flash-lite-preview',
      'gemini-3-flash-preview',
      'gemini-3.1-flash-live-preview',
    ];

    let response = null;
    let lastModelError = null;

    for (const model of MODEL_FALLBACKS) {
      try {
        response = await genai.models.generateContent({ model, contents: prompt });
        break; // success — exit loop
      } catch (modelErr) {
        const statusCode = modelErr?.status ?? modelErr?.error?.code ?? 0;
        if (statusCode === 503 || statusCode === 429) {
          console.warn(`[Gemini] ${model} unavailable (${statusCode}), trying next model...`);
          lastModelError = modelErr;
        } else {
          throw modelErr; // non-transient error — rethrow immediately
        }
      }
    }

    if (!response) {
      throw new Error(
        `All Gemini models are currently unavailable. Please try again shortly. (${lastModelError?.message})`
      );
    }

    // ── 7. PARSE GEMINI RESPONSE ─────────────────────────────────────────────
    let result = { analysis: '', charts: [], insights: [], suggestions: [] };
    try {
      const raw = response.text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(raw);
      result.analysis = parsed.analysis || response.text;
      result.insights = Array.isArray(parsed.insights) ? parsed.insights : [];
      result.suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
      

      // Normalize charts into Chart.js config format
      if (Array.isArray(parsed.charts)) {
        result.charts = parsed.charts.map((chart) => ({
          type: chart.type || 'bar',
          data: {
            labels: chart.labels || [],
            datasets: Array.isArray(chart.datasets) ? chart.datasets : [],
          },
          options: {
            responsive: true,
            plugins: { title: { display: true, text: chart.title || '' } },
          },
        }));
      }
    } catch {
      console.warn('[Gemini] Non-JSON response, falling back to plain text');
      result.analysis = response.text || 'Analysis complete.';
    }

    // ── 8. SAVE MESSAGES ─────────────────────────────────────────────────────
    const { count: msgCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', activeConvoId);

    const seq = msgCount || 0;

    await supabase.from('messages').insert([
      {
        conversation_id: activeConvoId,
        role: 'user',
        content: `📎 ${fileObj.originalname}\n\n${question.trim()}`,
        sequence_number: seq,
      },
      {
        conversation_id: activeConvoId,
        role: 'assistant',
        content: result.analysis,
        sequence_number: seq + 1,
        metadata: {
          charts: result.charts,
          insights: result.insights,
          suggestions: result.suggestions,
          filename: fileObj.originalname,
        },
      },
    ]);

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', activeConvoId);

    // ── 9. RESPOND ───────────────────────────────────────────────────────────
    res.json({
      analysis: result.analysis,
      charts: result.charts,
      insights: result.insights,
      suggestions: result.suggestions,
      filename: fileObj.originalname,
      rows: rowCount,
      columns,
      conversationId: activeConvoId, // ← always return so frontend can track
    });
  } catch (err) {
    console.error('[/files/analyze]', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;