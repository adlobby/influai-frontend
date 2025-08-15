// src/lib/api.ts
import { createSupabaseBrowserClient } from './lib/supabase-browser';

export async function apiFetch(path: string, init: RequestInit = {}) {
  const supabase = createSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(init.headers || {});
  if (!headers.has('content-type')) headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers, credentials: init.credentials ?? 'include' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res;
}

export type Chat = {
  _id: string;
  title: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
};

// --- helpers to coerce shapes ---
function coerceArray<T = unknown>(data: any, ...keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  for (const k of keys) {
    const v = (data ?? {})[k];
    if (Array.isArray(v)) return v as T[];
  }
  return [];
}

// convenience functions
export async function listChats(): Promise<Chat[]> {
  const res = await apiFetch('/api/chats');
  const data = await res.json();
  return coerceArray<Chat>(data, 'results', 'items', 'data', 'chats');
}

export async function createChat(title: string): Promise<Chat> {
  const res = await apiFetch('/api/chats', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function listMessages(chatId: string): Promise<Message[]> {
  const res = await apiFetch(`/api/chats/${chatId}/messages`);
  const data = await res.json();
  return coerceArray<Message>(data, 'results', 'items', 'data', 'messages');
}

export async function addMessage(
  chatId: string,
  content: string,
  role: 'user' | 'assistant' = 'user'
): Promise<Message> {
  const res = await apiFetch(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content, role }),
  });
  return res.json();
}
