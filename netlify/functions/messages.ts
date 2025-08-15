import type { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { getDb, getUserId, json } from './_utils';

export const handler: Handler = async (event) => {
  const userId = await getUserId(event);
  if (!userId) return json(401, { error: 'Unauthorized' });

  const chatId = event.queryStringParameters?.id;
  if (!chatId) return json(400, { error: 'Missing chat id' });

  const db = await getDb();
  const _id = new ObjectId(chatId);

  // Make sure this chat belongs to the user
  const chat = await db.collection('chats').findOne({ _id, userId });
  if (!chat) return json(404, { error: 'Chat not found' });

  if (event.httpMethod === 'GET') {
    const messages = await db.collection('messages')
      .find({ chatId: _id, userId })
      .sort({ createdAt: 1 })
      .toArray();
    return json(200, { messages });
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const content = String(body.content || '');
    const role = (body.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant';
    if (!content) return json(400, { error: 'Missing content' });

    const now = new Date();
    await db.collection('messages').insertOne({
      chatId: _id, userId, role, content, createdAt: now,
    });
    await db.collection('chats').updateOne({ _id }, { $set: { updatedAt: now } });

    return json(200, { ok: true });
  }

  return json(405, { error: 'Method not allowed' });
};
