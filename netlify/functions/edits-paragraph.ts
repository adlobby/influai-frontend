// netlify/functions/edits-paragraph.ts
import type { Handler } from "@netlify/functions";

const HF_MODELS = [
  "mistralai/Mistral-7B-Instruct-v0.3",
  "HuggingFaceH4/zephyr-7b-beta",
  "Qwen/Qwen2.5-7B-Instruct",
] as const;

const HF_TOKEN = process.env.HF_TOKEN || "";

const CORS_HEADERS = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST,OPTIONS",
  "access-control-allow-headers": "Content-Type, Authorization",
};

function json(statusCode: number, body: any) {
  return { statusCode, body: JSON.stringify(body), headers: CORS_HEADERS };
}

async function hfGenerate(model: string, prompt: string) {
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
          max_new_tokens: 300,
          temperature: 0.5,
          return_full_text: false,
        },
        options: { wait_for_model: true },
      }),
    }
  );
  if (!res.ok) throw new Error(`HF ${model} ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as Array<{ generated_text?: string }>;
  return (data?.[0]?.generated_text || "").trim();
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS_HEADERS } as any;
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

    const {
      selected,
      instruction,
      fullText,
      niche,
      audience,
      tones,
      durationMin,
    } = JSON.parse(event.body || "{}") as {
      selected: string;
      instruction: string;
      fullText?: string;
      niche?: string;
      audience?: string;
      tones?: string[] | string;
      durationMin?: number;
    };

    if (!selected || !instruction) {
      return json(400, { error: "Missing selected/instruction" });
    }

    const tonesArr: string[] = Array.isArray(tones)
      ? tones
      : typeof tones === "string" && tones.trim()
      ? tones.split("+").map((s) => s.trim())
      : [];

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
    ]
      .filter(Boolean)
      .join("\n");

    let lastErr: unknown = null;
    for (const m of HF_MODELS) {
      try {
        const out = await hfGenerate(m, prompt);
        const clean = out.replace(/\n\n+/g, " ").trim();
        return json(200, { rewritten: clean || selected });
      } catch (e) {
        lastErr = e;
      }
    }

    throw lastErr || new Error("All HF models failed");
  } catch (err: any) {
    return json(500, { error: err?.message || "edits-paragraph failed" });
  }
};
