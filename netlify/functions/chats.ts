import type { Handler } from '@netlify/functions';
import { getDb, getUserId, json } from './_utils';

export const handler: Handler = async (event) => {
  const userId = await getUserId(event);
  if (!userId) return json(401, { error: 'Unauthorized' });

  const db = await getDb();

  if (event.httpMethod === 'GET') {
    const chats = await db.collection('chats')
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    return json(200, { chats });
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const title = String(body.title || 'New chat');
    const now = new Date();
    const { insertedId } = await db.collection('chats').insertOne({
      userId, title, createdAt: now, updatedAt: now,
    });
    return json(200, { chatId: insertedId.toString() });
  }

  return json(405, { error: 'Method not allowed' });
};
