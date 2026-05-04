// Central place for all backend API calls.
// Every function gets the token from the caller (Dashboard manages auth state).

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Shared fetch wrapper — attaches auth header automatically
async function apiFetch(path, options = {}, token) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

/**
 * Send a message to a feature.
 * @param {string} query         - the user's message
 * @param {string} serviceSlug   - 'blog_generator' | 'seo_optimizer' | 'sentiment_analysis'
 * @param {string|null} conversationId - null = start new conversation
 * @param {string} token         - Supabase JWT
 * @returns {{ response: string, conversationId: string }}
 */
export async function sendMessage(query, serviceSlug, conversationId, token) {
  return apiFetch('/query', {
    method: 'POST',
    body: JSON.stringify({ query, serviceSlug, conversationId }),
  }, token);
}

// ─── Conversations ────────────────────────────────────────────────────────────

/**
 * Load the sidebar conversation list.
 * @param {string} token
 * @param {string} [serviceSlug] - optional filter by feature
 */
export async function getConversations(token, serviceSlug) {
  const qs = serviceSlug ? `?serviceSlug=${serviceSlug}` : '';
  return apiFetch(`/conversations${qs}`, { method: 'GET' }, token);
}

/**
 * Load all messages in a conversation.
 * @param {string} conversationId
 * @param {string} token
 */
export async function getMessages(conversationId, token) {
  return apiFetch(`/conversations/${conversationId}/messages`, { method: 'GET' }, token);
}

/**
 * Archive (soft-delete) a conversation.
 */
export async function archiveConversation(conversationId, token) {
  return apiFetch(`/conversations/${conversationId}/archive`, { method: 'PATCH' }, token);
}