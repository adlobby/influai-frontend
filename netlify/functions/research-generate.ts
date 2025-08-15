import type { Handler } from "@netlify/functions";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Try these models in order (first that works wins). */
const HF_MODELS = [
  "mistralai/Mistral-7B-Instruct-v0.3",
  "HuggingFaceH4/zephyr-7b-beta",
  "Qwen/Qwen2.5-7B-Instruct",
] as const;

const HF_TOKEN = process.env.HF_TOKEN || ""; // set in Netlify env
const EMBED_MODEL =
  process.env.EMBED_MODEL || "sentence-transformers/all-MiniLM-L6-v2";

/** Optional: Supabase client (used for RAG/grounding). */
const supabase: SupabaseClient | null =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    : null;

/* ---------- tiny utils ---------- */
const CORS_HEADERS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST,OPTIONS",
  "access-control-allow-headers": "Content-Type, Authorization",
};
const json = (statusCode: number, body: any) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: CORS_HEADERS,
});
const isTaskMismatch = (msg: string) =>
  /not supported for task|task not supported|unsupported/i.test(msg);

/* ---------- Hugging Face calls ---------- */

/** Text generation via Inference API. */
async function hfGenerate(opts: {
  model: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}) {
  const { model, prompt, maxTokens = 900, temperature = 0.7 } = opts;
  if (!HF_TOKEN) throw new Error("HF_TOKEN is not configured");

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature,
          top_p: 0.95,
          return_full_text: false,
        },
        options: { wait_for_model: true },
      }),
    }
  );

  const raw = await res.text();
  if (!res.ok) throw new Error(`HF ${model} ${res.status}: ${raw.slice(0, 400)}`);

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    data = raw;
  }

  // API sometimes returns array or object
  const text = Array.isArray(data)
    ? data[0]?.generated_text ?? ""
    : data?.generated_text ?? "";

  return (text || "").trim();
}

/** Conversational (chat) fallback via Inference API. */
async function hfChat(opts: {
  model: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}) {
  const { model, prompt, maxTokens = 900, temperature = 0.7 } = opts;
  if (!HF_TOKEN) throw new Error("HF_TOKEN is not configured");

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      // minimal single-turn conversational payload
      body: JSON.stringify({
        inputs: {
          past_user_inputs: [],
          generated_responses: [],
          text: prompt,
        },
        parameters: {
          max_new_tokens: maxTokens,
          temperature,
        },
        options: { wait_for_model: true },
      }),
    }
  );

  const raw = await res.text();
  if (!res.ok) throw new Error(`HF(chat) ${model} ${res.status}: ${raw.slice(0, 400)}`);

  const data = JSON.parse(raw);
  // Conversational returns { generated_text, conversation: {...} } or array
  const text = Array.isArray(data)
    ? data[0]?.generated_text ?? ""
    : data?.generated_text ?? "";

  return (text || "").trim();
}

/** Try text-gen first; if task mismatch/err, try chat; then next model. */
async function generateWithFallback(prompt: string) {
  let lastErr: unknown = null;
  for (const model of HF_MODELS) {
    try {
      return await hfGenerate({ model, prompt });
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (isTaskMismatch(msg)) {
        try {
          return await hfChat({ model, prompt });
        } catch (e2) {
          lastErr = e2;
          continue;
        }
      }
      lastErr = e;
    }
  }
  throw lastErr || new Error("All HF models failed");
}

/** Single-text embedding via HF feature-extraction. */
async function hfEmbed(text: string) {
  if (!HF_TOKEN) throw new Error("HF_TOKEN is not configured");

  const res = await fetch(
    `https://api-inference.huggingface.co/pipeline/feature-extraction/${encodeURIComponent(
      EMBED_MODEL
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
    }
  );

  if (!res.ok) throw new Error(`HF embed ${res.status}: ${await res.text()}`);

  const vec = (await res.json()) as number[] | number[][];
  return Array.isArray(vec[0]) ? (vec as number[][])[0] : (vec as number[]);
}

/* ---------- Grounding helpers (Supabase) ---------- */

/** Use your Postgres function `match_chunks` (pgvector) via supabase.rpc. */
async function sbMatchChunks(embedding: number[], k = 6, threshold = 0.75) {
  if (!supabase) return [] as Array<{ title?: string; content?: string }>;

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    similarity_threshold: threshold,
    match_count: k,
  });

  if (error || !data) return [];
  return data as Array<{ title?: string; content?: string }>;
}

/** Fallback naive search (if RPC/pgvector not available). */
async function sbNaiveSearch(q: string) {
  if (!supabase || !q) return [];
  const { data, error } = await supabase
    .from("documents") // change table name if different
    .select("title, content")
    .ilike("content", `%${q}%`)
    .limit(6);

  if (error || !data) return [];
  return data as Array<{ title?: string; content?: string }>;
}

/* ---------- Prompt builder ---------- */
function ytStructure({
  durationMin,
  tones,
}: {
  durationMin?: number;
  tones?: string[];
}) {
  const len = durationMin || 4;
  const toneLine =
    tones && tones.length ? `- Tone: ${tones.join(" + ")}.` : undefined;

  return [
    `Create a ${len}-minute YouTube script in this exact structure:`,
    "",
    "H1: Hook (one punchy line within 3s)",
    "H2: Short Intro (who & why this matters)",
    "H2: The Problem (what viewers struggle with)",
    "H2: The Solution (your core idea/approach)",
    "H2: Strategy Breakdown (3–5 sections)",
    "H2: Personal Plan (what to do this week)",
    "H2: Mindset Shift (reframe or encouragement)",
    "H2: Call-to-Action (subscribe/like/next step)",
    "H2: Video Notes (B-roll ideas & timestamp hints)",
    "",
    "Rules:",
    "- Use clear, tight sentences.",
    "- Mark H1/H2 headings exactly as shown.",
    "- Add timestamp hints like [0:15] when helpful.",
    "- Keep the script engaging and specific.",
    toneLine,
  ]
    .filter(Boolean)
    .join("\n");
}

/* ---------- Handler ---------- */
export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: CORS_HEADERS } as any;
    }
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method not allowed" });
    }

    const { channel, values } = JSON.parse(event.body || "{}") as {
      channel: string;
      values: Record<string, any>;
    };

    if (channel !== "yt_script") {
      return json(400, { error: "Unsupported channel" });
    }

    // ---------- RAG / grounding ----------
    let knowledge = "";
    const query = (values.topic || values.niche || "").toString().trim();

    if (query && supabase) {
      let chunks: Array<{ title?: string; content?: string }> = [];

      if (values.deepResearch) {
        try {
          const qvec = await hfEmbed(query);
          const hits = await sbMatchChunks(qvec, 6, 0.75);
          if (hits?.length) chunks = hits;
        } catch {
          // ignore and fall back to naive
        }
      }

      if (!chunks.length) {
        const naive = await sbNaiveSearch(query);
        if (naive?.length) chunks = naive;
      }

      if (chunks?.length) {
        knowledge =
          "Relevant knowledge:\n" +
          chunks
            .map((d, i) => {
              const title = d.title || `Doc ${i + 1}`;
              const piece = String(d.content || "").slice(0, 600);
              return `- ${title}: ${piece}`;
            })
            .join("\n");
      }
    }

    // ---------- Build the prompt ----------
    const tonesArr: string[] = Array.isArray(values.tones)
      ? values.tones
      : typeof values.tones === "string" && values.tones.trim()
      ? values.tones.split("+").map((s: string) => s.trim())
      : [];

    const structure = ytStructure({
      durationMin: Number(values.durationMin) || 4,
      tones: tonesArr,
    });

    const userPrompt = [
      "You are an expert YouTube script writer. Follow the requested structure exactly.",
      values.niche ? `Niche: ${values.niche}` : "",
      values.topic ? `Topic/Brief: ${values.topic}` : "",
      values.audience ? `Audience: ${values.audience}` : "",
      tonesArr.length ? `Tone(s): ${tonesArr.join(" + ")}` : "",
      values.prompt ? `Custom guidance: ${values.prompt}` : "",
      knowledge || "",
      structure,
      "Use any knowledge snippets above if helpful; synthesize into original prose.",
      values.deepResearch
        ? "If facts are included, favor accuracy and phrase them in your own words."
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const content = await generateWithFallback(userPrompt);
    return json(200, { content });
  } catch (err: any) {
    return json(500, { error: err?.message || "research-generate failed" });
  }
};
