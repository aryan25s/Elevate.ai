import { Router } from 'express';
import multer from 'multer';
import Papa from 'papaparse';
import { supabase } from '../supabase.js';
import { genai } from '../gemini.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' ||
        file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are supported'));
    }
  },
});

// ─── POST /files/analyze ──────────────────────────────────────────────────────
// Accepts a CSV + a question, returns analysis + optional chart config
router.post('/analyze', upload.single('file'), async (req, res) => {
  const userId = req.user.id;
  const { question, conversationId } = req.body;

  if (!req.file) return res.status(400).json({ error: 'No CSV file provided' });
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    // 1. Parse the CSV with Papa Parse
    const csvText = req.file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvText, {
      header: true,       // first row = column names
      skipEmptyLines: true,
      dynamicTyping: true, // auto-convert numbers
    });

    if (parsed.errors.length > 0) {
      return res.status(400).json({ error: 'Could not parse CSV: ' + parsed.errors[0].message });
    }

    const rows = parsed.data;
    const columns = parsed.meta.fields;
    const rowCount = rows.length;

    // 2. Build a data summary (send first 50 rows max to stay within token limits)
    const sampleRows = rows.slice(0, 50);
    const dataSummary = `
Dataset: ${req.file.originalname}
Rows: ${rowCount} | Columns: ${columns.length}
Columns: ${columns.join(', ')}

First ${sampleRows.length} rows (JSON):
${JSON.stringify(sampleRows, null, 2)}
    `.trim();

    // 3. Build stats for numeric columns automatically
    const numericStats = {};
    columns.forEach(col => {
      const vals = rows.map(r => r[col]).filter(v => typeof v === 'number' && !isNaN(v));
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

    // 4. Prompt Gemini — ask it to return JSON with analysis + optional chart
    const prompt = `
You are a data analyst. You have been given a CSV dataset.

${dataSummary}

Numeric column statistics:
${JSON.stringify(numericStats, null, 2)}

User question: "${question}"

Respond with a JSON object in this exact format (no markdown, no backticks, just raw JSON):
{
  "analysis": "Your clear plain-English analysis answering the question. Include specific numbers and insights. Use \\n for line breaks.",
  "chart": {
    "type": "bar" | "line" | "pie" | "scatter" | null,
    "title": "Chart title",
    "labels": ["label1", "label2", ...],
    "datasets": [
      {
        "label": "Dataset name",
        "data": [1, 2, 3, ...]
      }
    ]
  }
}

If no chart is appropriate for this question, set "chart" to null.
For scatter charts, data should be [{x: ..., y: ...}] objects.
Choose the chart type that best visualizes the answer.
Keep labels to max 10 items for readability.
    `.trim();

    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 5. Parse Gemini's JSON response
    let result;
    try {
      const raw = response.text.replace(/```json|```/g, '').trim();
      result = JSON.parse(raw);
    } catch {
      // If Gemini didn't return valid JSON, return as plain text
      result = { analysis: response.text, chart: null };
    }

    // 6. Save to messages if we have a conversationId
    if (conversationId) {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          role: 'user',
          content: `📎 ${req.file.originalname}\n\n${question}`,
          sequence_number: count || 0,
        },
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: result.analysis,
          sequence_number: (count || 0) + 1,
          metadata: { chart: result.chart, filename: req.file.originalname },
        },
      ]);

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    }

    res.json({
      analysis: result.analysis,
      chart: result.chart,        // Chart.js config — null if no chart
      filename: req.file.originalname,
      rows: rowCount,
      columns,
    });

  } catch (err) {
    console.error('[/files/analyze]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;