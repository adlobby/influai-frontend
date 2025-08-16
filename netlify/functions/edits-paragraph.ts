// netlify/functions/edits-paragraph.ts
import type { Handler } from "@netlify/functions";

const HF_MODELS = [
  "mistralai/Mistral-7B-Instruct-v0.3",
  "mistralai/Mixtral-8x7B-Instruct-v0.1",
  "HuggingFaceH4/zephyr-7b-beta",
  "Qwen/Qwen2.5-7B-Instruct",
] as const;

const TOKENS = [
  ...(process.env.HF_TOKEN ? [process.env.HF_TOKEN] : []),
  ...((process.env.HF_TOKENS_ROTATE || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)),
];

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

async function callHF(token: string, url: string, payload: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${raw.slice(0, 400)}`);
  try { return JSON.parse(raw); } catch { return raw; }
}

async function hfGenerate(model: string, prompt: string, token: string) {
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
  const data = await callHF(token, url, {
    inputs: prompt,
    parameters: {
      max_new_tokens: 512,
      temperature: 0.5,
      return_full_text: false,
      repetition_penalty: 1.05,
    },
    options: { wait_for_model: true },
  });
  const text = Array.isArray(data) ? data[0]?.generated_text : (data as any)?.generated_text;
  return (text || "").trim();
}

async function hfChat(model: string, prompt: string, token: string) {
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
  const data = await callHF(token, url, {
    inputs: { past_user_inputs: [], generated_responses: [], text: prompt },
    parameters: { max_new_tokens: 512, temperature: 0.5 },
    options: { wait_for_model: true },
  });
  const text = Array.isArray(data) ? data[0]?.generated_text : (data as any)?.generated_text;
  return (text || "").trim();
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS_HEADERS } as any;
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

    const { selected, instruction, fullText, niche, audience, tones, durationMin } = JSON.parse(event.body || "{}");
    if (!selected || !instruction) return json(400, { error: "Missing selected/instruction" });

    const tonesArr: string[] =
      Array.isArray(tones) ? tones :
      typeof tones === "string" && tones.trim() ? tones.split("+").map((s) => s.trim()) : [];

    const prompt = [
      "Rewrite ONLY the following paragraph according to the instruction.",
      "Keep roughly the same length and preserve the voice unless instructed otherwise.",
      "Return the rewritten paragraph ONLY (no headings or commentary).",
      niche ? `Niche: ${niche}` : "",
      audience ? `Audience: ${audience}` : "",
      tonesArr.length ? `Tone(s): ${tonesArr.join(" + ")}` : "",
      durationMin ? `Full video length target: ~${durationMin} minutes.` : "",
      fullText ? "\nContext (do NOT repeat, just keep style coherent):\n" + fullText : "",
      "\nInstruction:",
      instruction,
      "\nParagraph:",
      selected,
      "\nRewritten paragraph:",
    ].filter(Boolean).join("\n");

    if (TOKENS.length === 0) return json(500, { error: "HF token not configured" });

    let lastErr: unknown = null;
    for (const model of HF_MODELS) {
      for (const tok of TOKENS) {
        try {
          const out = await hfGenerate(model, prompt, tok);
          return json(200, { rewritten: out.replace(/\n\n+/g, " ").trim(), model });
        } catch (e: any) {
          const msg = String(e?.message || "");
          if (isTaskMismatch(msg)) {
            try {
              const out = await hfChat(model, prompt, tok);
              return json(200, { rewritten: out.replace(/\n\n+/g, " ").trim(), model });
            } catch (e2) { lastErr = e2; continue; }
          }
          lastErr = e;
        }
      }
    }
    throw lastErr || new Error("All HF models failed");
  } catch (err: any) {
    return json(500, { error: err?.message || "edits-paragraph failed" });
  }
};
