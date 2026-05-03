import { Router } from 'express';
import { supabase } from '../supabase.js';

const router = Router();

// GET /conversations — list all conversations for the sidebar
// Optional ?serviceSlug=blog_generator to filter by feature
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const { serviceSlug } = req.query;

  let query = supabase
    .from('conversations')
    .select('id, title, updated_at, services(slug, name)')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false });

  // If a service filter is passed, filter by it
  if (serviceSlug) {
    const { data: service } = await supabase
      .from('services')
      .select('id')
      .eq('slug', serviceSlug)
      .single();

    if (service) query = query.eq('service_id', service.id);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /conversations/:id/messages — load all messages in a conversation
router.get('/:id/messages', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Verify this conversation belongs to the requesting user
  const { data: convo } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!convo) return res.status(404).json({ error: 'Conversation not found' });

  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, metadata, created_at')
    .eq('conversation_id', id)
    .order('sequence_number', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PATCH /conversations/:id/archive — archive a conversation
router.patch('/:id/archive', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { error } = await supabase
    .from('conversations')
    .update({ is_archived: true })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;