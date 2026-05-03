import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../supabase.js';
import { genai } from '../gemini.js';

const router = Router();
// Store file in memory (buffer) — we push it straight to Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    // Only allow CSV and Excel for the pandas agent
    const allowed = ['text/csv', 'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only CSV and Excel files are allowed'));
  },
});

// POST /files/upload — upload a file and register it in the DB
router.post('/upload', upload.single('file'), async (req, res) => {
  const userId = req.user.id;
  const { conversationId } = req.body;

  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  if (!conversationId) return res.status(400).json({ error: 'conversationId is required' });

  // Verify the conversation belongs to this user
  const { data: convo } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (!convo) return res.status(404).json({ error: 'Conversation not found' });

  try {
    // 1. Upload to Supabase Storage
    const storagePath = `${userId}/${conversationId}/${Date.now()}_${req.file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('uploads')                         // your bucket name in Supabase
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);

    // 2. Register the file in the DB
    const { data: fileRecord, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        filename: req.file.originalname,
        storage_path: storagePath,
        mime_type: req.file.mimetype,
        file_size_bytes: req.file.size,
        status: 'ready',
      })
      .select('id, filename, status')
      .single();

    if (dbError) throw new Error(dbError.message);

    res.json({ file: fileRecord });

  } catch (err) {
    console.error('[/files/upload]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /files/query — query a file with natural language (AI data scientist)
router.post('/query', async (req, res) => {
  const userId = req.user.id;
  const { question, fileId, conversationId } = req.body;

  // 1. Fetch the file record and verify ownership
  const { data: file } = await supabase
    .from('uploaded_files')
    .select('storage_path, filename, status')
    .eq('id', fileId)
    .eq('user_id', userId)
    .single();

  if (!file) return res.status(404).json({ error: 'File not found' });
  if (file.status !== 'ready') return res.status(400).json({ error: 'File is not ready yet' });

  try {
    // 2. Download file from Supabase Storage as a buffer
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('uploads')
      .download(file.storage_path);

    if (downloadError) throw new Error(downloadError.message);

    // 3. Convert to text (for CSV — for Excel you'd need a parser like xlsx)
    const fileText = await fileData.text();

    // 4. Send to Gemini with the file contents inline
    const { data: service } = await supabase
      .from('services')
      .select('system_prompt')
      .eq('slug', 'ai_data_scientist')
      .single();

    const prompt = `
Here is the contents of the file "${file.filename}":

\`\`\`
${fileText.slice(0, 20000)}  
\`\`\`

User question: ${question}

Analyze the data and answer the question clearly. Include code examples if helpful.
    `.trim();

    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: service.system_prompt },
    });

    // 5. Save to messages
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId);

    await supabase.from('messages').insert([
      { conversation_id: conversationId, role: 'user', content: question, sequence_number: count },
      { conversation_id: conversationId, role: 'assistant', content: response.text, sequence_number: count + 1 },
    ]);

    res.json({ response: response.text });

  } catch (err) {
    console.error('[/files/query]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;