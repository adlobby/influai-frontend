import type { HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { MongoClient, type Db } from "mongodb";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

let _mongo: MongoClient | null = null;

export async function getDb(): Promise<Db> {
  if (!_mongo) {
    _mongo = new MongoClient(process.env.MONGODB_URI!);
    await _mongo.connect();
  }
  return _mongo.db(process.env.MONGODB_DB!);
}

export async function getUserId(event: HandlerEvent): Promise<string | null> {
  const auth = event.headers.authorization || event.headers.Authorization;
  if (!auth || !String(auth).startsWith("Bearer ")) return null;
  const token = String(auth).slice("Bearer ".length);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
}

export const json = (status: number, body: any) => ({
  statusCode: status,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
