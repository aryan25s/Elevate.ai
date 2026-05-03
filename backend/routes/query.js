import { Router } from 'express';
import { supabase } from '../supabase.js';
import { genai } from '../gemini.js';

const router = Router();

// ─── Get service row (system prompt + id) by slug ────────────────────────────
async function getService(slug) {
  const { data, error } = await supabase
    .from('services')
    .select('id, system_prompt')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw new Error(`Service "${slug}" not found`);
  return data;
}

// ─── Get or create a conversation ────────────────────────────────────────────
async function getOrCreateConversation(userId, serviceId, conversationId) {
  // Existing conversation — just return the id
  if (conversationId) return conversationId;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, service_id: serviceId })
    .select('id')
    .single();

  if (error) throw new Error('Failed to create conversation');
  return data.id;
}

// ─── Load prior messages as Gemini history ───────────────────────────────────
async function loadHistory(conversationId) {
  const { data } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('sequence_number', { ascending: true });

  // Gemini expects role "model" not "assistant"
  return (data || []).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

// ─── Save a message and bump conversation updated_at ─────────────────────────
async function saveMessage(conversationId, role, content, sequenceNumber, metadata = null) {
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    role,
    content,
    sequence_number: sequenceNumber,
    metadata,
  });

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);
}

// ─── Auto-title the conversation from first message ───────────────────────────
async function maybeTitleConversation(conversationId, firstMessage) {
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId);

  if (count === 0) {
    const title = firstMessage.slice(0, 60) + (firstMessage.length > 60 ? '…' : '');
    await supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId);
  }
}

// ─── POST /query ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { query, serviceSlug, conversationId } = req.body;
  const userId = req.user.id;  // set by auth middleware

  if (!query || !serviceSlug) {
    return res.status(400).json({ error: 'query and serviceSlug are required' });
  }

  try {
    // 1. Get the service (validates slug + fetches system prompt)
    const service = await getService(serviceSlug);

    // 2. Get or create the conversation
    const activeConvoId = await getOrCreateConversation(userId, service.id, conversationId);

    // 3. Auto-title on first message
    await maybeTitleConversation(activeConvoId, query);

    // 4. Get the current message count for sequence numbering
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', activeConvoId);
    const nextSeq = count || 0;

    // 5. Load history so Gemini remembers the conversation
    const history = await loadHistory(activeConvoId);

    // 6. Save the user's message before calling Gemini
    await saveMessage(activeConvoId, 'user', query, nextSeq);

    // 7. Call Gemini with full conversation history
    const chat = genai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: service.system_prompt },
      history,
    });
    const geminiRes = await chat.sendMessage({ message: query });
    const assistantText = geminiRes.text;

    // 8. Save Gemini's response
    await saveMessage(activeConvoId, 'assistant', assistantText, nextSeq + 1);

    // 9. Return to frontend
    res.json({
      response: assistantText,
      conversationId: activeConvoId,  // frontend stores this for the next message
    });

  } catch (err) {
    console.error('[/query]', err.message);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

export default router;