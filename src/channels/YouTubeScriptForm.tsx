// src/channels/YouTubeScriptForm.tsx
import { useEffect, useMemo, useState } from "react";
import type { ChannelFormProps } from "./types";

const TONES = [
  "Educational",
  "Funny",
  "Inspirational",
  "Casual",
  "Professional",
] as const;

export type YtValues = {
  niche: string;                 // required
  topic?: string;                // optional
  audience?: string;             // optional
  durationMin?: number;          // typed number
  tones?: string[];              // multi-select
  prompt?: string;               // custom prompt (optional)
};

const LS_KEY = "yt.form.v1";

export default function YouTubeScriptForm({
  onCancel,
  onGenerate,
}: ChannelFormProps<YtValues>) {
  const [v, setV] = useState<YtValues>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { niche: "", topic: "", audience: "", durationMin: 4, tones: [], prompt: "" };
  });
  const [deepResearch, setDeepResearch] = useState<boolean>(() => {
    try {
      return localStorage.getItem("yt.deepResearch") === "1";
    } catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(v));
  }, [v]);

  useEffect(() => {
    localStorage.setItem("yt.deepResearch", deepResearch ? "1" : "0");
  }, [deepResearch]);

  const canSubmit = useMemo(() => v.niche.trim().length > 0, [v.niche]);

  function toggleTone(t: string) {
    setV((s) => {
      const set = new Set(s.tones ?? []);
      set.has(t) ? set.delete(t) : set.add(t);
      return { ...s, tones: Array.from(set) };
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate(v, { deepResearch });
  }

  const inputCls =
    "w-full bg-[#0A0F1F] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#6C5CE7]";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400">
            Channel
          </div>
          <h2 className="text-2xl font-bold">YouTube Script</h2>
          <div className="text-sm text-gray-400">
            Fill the brief (topic is optional) and click <b>Start generating</b>.
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Deep Research Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm text-gray-300">Deep research</span>
            <span
              onClick={() => setDeepResearch((v) => !v)}
              className={`w-12 h-7 rounded-full p-1 transition ${
                deepResearch ? "bg-[#00E5FF]/60" : "bg-white/10"
              }`}
            >
              <span
                className={`block w-5 h-5 bg-white rounded-full transition ${
                  deepResearch ? "translate-x-5" : ""
                }`}
              />
            </span>
          </label>

          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Niche (required) */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Niche *</span>
            <input
              required
              value={v.niche}
              onChange={(e) => setV({ ...v, niche: e.target.value })}
              className={inputCls}
              placeholder="e.g., AI for marketers, fitness, crypto"
            />
          </label>

          {/* Topic / Brief (optional) */}
          <label className="flex flex-col gap-2 md:col-span-1">
            <span className="text-sm text-gray-300">Topic / Brief (optional)</span>
            <textarea
              value={v.topic || ""}
              onChange={(e) => setV({ ...v, topic: e.target.value })}
              className={inputCls}
              rows={3}
              placeholder="Outline or brief (optional)…"
            />
          </label>

          {/* Audience (optional) */}
          <label className="flex flex-col gap-2 md:col-span-1">
            <span className="text-sm text-gray-300">Audience (optional)</span>
            <input
              value={v.audience || ""}
              onChange={(e) => setV({ ...v, audience: e.target.value })}
              className={inputCls}
              placeholder="e.g., SaaS founders, freelancers"
            />
          </label>

          {/* Duration (typed) */}
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Approx. length (minutes)</span>
            <input
              inputMode="numeric"
              type="number"
              min={1}
              step="1"
              value={v.durationMin ?? 4}
              onChange={(e) =>
                setV({ ...v, durationMin: Number(e.target.value || 0) })
              }
              className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
          </label>

          {/* Tone (optional, multi-select) */}
          <div className="flex flex-col gap-2 md:col-span-1">
            <span className="text-sm text-gray-300">
              Tone (optional) — pick one or more
            </span>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => {
                const on = (v.tones || []).includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTone(t)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      on
                        ? "bg-[#6C5CE7]/20 border-[#6C5CE7]/60"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Prompt (optional) */}
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Custom Prompt (optional)</span>
          <textarea
            value={v.prompt || ""}
            onChange={(e) => setV({ ...v, prompt: e.target.value })}
            className={inputCls}
            rows={3}
            placeholder="Any extra guidance for the script…"
          />
        </label>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] disabled:opacity-60"
          >
            Start generating
          </button>
        </div>
      </form>
    </div>
  );
}
