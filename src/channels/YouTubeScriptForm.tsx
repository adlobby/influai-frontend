// channels/YouTubeScriptForm.tsx
import { useEffect, useMemo, useState } from "react";
import type { ChannelFormProps } from "./types";
import { getSupabase } from "../lib/supabase-browser";

const TONES = ["Educational","Funny","Inspirational","Casual","Professional"] as const;

export type YtValues = {
  niche: string;
  topic?: string;
  audience?: string;
  durationMin?: number;
  tones?: string[];
  prompt?: string;
  hooksCount?: number;
  // continuation
  prevScriptText?: string;
};

type ChatLite = { _id: string; title: string };
type MessageLite = { role: "user"|"assistant"|"system"; content: string };

const LS_KEY = "yt.form.v1";
const LS_DEEP = "yt.deepResearch";
const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

export default function YouTubeScriptForm({ onCancel, onGenerate }: ChannelFormProps<YtValues>) {
  const [v, setV] = useState<YtValues>(() => {
    try { const saved = localStorage.getItem(LS_KEY); if (saved) return JSON.parse(saved); } catch {}
    return { niche: "", topic: "", audience: "", durationMin: 4, tones: [], prompt: "", hooksCount: 1, prevScriptText: "" };
  });
  const [deepResearch, setDeepResearch] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_DEEP) === "1"; } catch { return false; }
  });

  const [showPrevModal, setShowPrevModal] = useState(false);
  const [chats, setChats] = useState<ChatLite[] | null>(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingPick, setLoadingPick] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(v)); }, [v]);
  useEffect(() => { localStorage.setItem(LS_DEEP, deepResearch ? "1" : "0"); }, [deepResearch]);

  const canSubmit = useMemo(() => v.niche.trim().length > 0, [v.niche]);

  function toggleTone(t: string) {
    setV((s) => {
      const set = new Set(s.tones ?? []);
      set.has(t) ? set.delete(t) : set.add(t);
      return { ...s, tones: Array.from(set) };
    });
  }

  function clampHooks(n: number) {
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(5, Math.round(n)));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate(
      { ...v, hooksCount: clampHooks(v.hooksCount ?? 1) },
      { deepResearch }
    );
  }

  const inputCls =
    "w-full bg-[#0A0F1F] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#6C5CE7]";

  async function authedFetch<T = any>(url: string, init: RequestInit = {}) {
    const supabase = getSupabase();
    const { data: { session } } = (await supabase?.auth.getSession()) || { data: { session: null as any } };
    const headers = new Headers(init.headers || {});
    headers.set("content-type", "application/json");
    if (session?.access_token) headers.set("authorization", `Bearer ${session.access_token}`);
    const full = url.startsWith("http") ? url : `${API_BASE}${url}`;
    const res = await fetch(full, { ...init, headers });
    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch {}
    if (!res.ok) throw new Error(json?.error || res.statusText);
    return json as T;
  }

  async function openPrevModal() {
    setShowPrevModal(true);
    if (chats !== null) return;
    try {
      setLoadingChats(true);
      const list = await authedFetch<ChatLite[]>(`/chats`);
      setChats(list.map((c: any) => ({ _id: c._id || c.id, title: c.title })));
    } catch {
      // ignore
    } finally {
      setLoadingChats(false);
    }
  }

  async function useLastAssistantFrom(chatId: string) {
    try {
      setLoadingPick(chatId);
      const msgs = await authedFetch<MessageLite[]>(`/chats/${chatId}/messages`);
      const last = [...msgs].reverse().find(m => m.role === "assistant");
      if (last?.content) {
        setV(s => ({ ...s, prevScriptText: last.content }));
        setShowPrevModal(false);
      }
    } catch {
      // ignore
    } finally {
      setLoadingPick(null);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      setV(s => ({ ...s, prevScriptText: text }));
      setShowPrevModal(false);
    };
    reader.readAsText(file);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400">Channel</div>
          <h2 className="text-2xl font-bold">YouTube Script</h2>
          <div className="text-sm text-gray-400">Fill the brief (topic is optional) and click <b>Start generating</b>.</div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm text-gray-300">Deep research</span>
            <span onClick={() => setDeepResearch((v) => !v)}
              className={`w-12 h-7 rounded-full p-1 transition ${deepResearch ? "bg-[#00E5FF]/60" : "bg-white/10"}`}>
              <span className={`block w-5 h-5 bg-white rounded-full transition ${deepResearch ? "translate-x-5" : ""}`} />
            </span>
          </label>

          <button onClick={onCancel} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm" type="button">
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Niche *</span>
            <input required value={v.niche} onChange={(e) => setV({ ...v, niche: e.target.value })}
              className={inputCls} placeholder="e.g., AI for marketers, fitness, crypto" />
          </label>

          <label className="flex flex-col gap-2 md:col-span-1">
            <span className="text-sm text-gray-300">Topic / Brief (optional)</span>
            <textarea value={v.topic || ""} onChange={(e) => setV({ ...v, topic: e.target.value })}
              className={inputCls} rows={3} placeholder="Outline or brief (optional)…" />
          </label>

          <label className="flex flex-col gap-2 md:col-span-1">
            <span className="text-sm text-gray-300">Audience (optional)</span>
            <input value={v.audience || ""} onChange={(e) => setV({ ...v, audience: e.target.value })}
              className={inputCls} placeholder="e.g., SaaS founders, freelancers" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Approx. length (minutes)</span>
            <input inputMode="numeric" type="number" min={1} step="1" value={v.durationMin ?? 4}
              onChange={(e) => setV({ ...v, durationMin: Math.max(1, Number(e.target.value || 1)) })}
              className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Number of Hooks</span>
            <input
              type="number"
              min={1}
              max={5}
              value={v.hooksCount ?? 1}
              onChange={(e) => setV((s) => ({ ...s, hooksCount: Math.max(1, Math.min(5, Number(e.target.value || 1))) }))}
              className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
            <span className="text-xs text-gray-500">Generate multiple punchy openings to A/B test (1–5).</span>
          </label>

          <div className="flex flex-col gap-2 md:col-span-1">
            <span className="text-sm text-gray-300">Tone (optional) — pick one or more</span>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => {
                const on = (v.tones || []).includes(t);
                return (
                  <button key={t} type="button" onClick={() => toggleTone(t)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${on ? "bg-[#6C5CE7]/20 border-[#6C5CE7]/60" : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Custom Prompt (optional)</span>
          <textarea value={v.prompt || ""} onChange={(e) => setV({ ...v, prompt: e.target.value })}
            className={inputCls} rows={3} placeholder="Any extra guidance for the script…" />
        </label>

        {/* Previous script section */}
        <div className="rounded-xl border border-white/10 p-3 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">Mention your previous script (for continuity)</div>
            <div className="flex gap-2">
              <button type="button" onClick={openPrevModal} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm">
                Pick from my chats
              </button>
              <label className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm cursor-pointer">
                Upload .txt/.md
                <input type="file" accept=".txt,.md" className="hidden" onChange={onFile} />
              </label>
              {v.prevScriptText && (
                <button type="button" onClick={() => setV(s => ({ ...s, prevScriptText: "" }))}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm">
                  Clear
                </button>
              )}
            </div>
          </div>
          {v.prevScriptText && (
            <div className="mt-2 text-xs text-gray-400 line-clamp-2">
              Preview: {v.prevScriptText.slice(0, 220)}{v.prevScriptText.length > 220 ? "…" : ""}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="submit" disabled={!canSubmit} className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] disabled:opacity-60">
            Start generating
          </button>
        </div>
      </form>

      {/* Previous script modal */}
      {showPrevModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={() => setShowPrevModal(false)}>
          <div className="w-full max-w-2xl rounded-xl bg-[#0A0F1F] border border-white/10 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Pick a previous chat</div>
              <button className="text-gray-400 hover:text-white" onClick={() => setShowPrevModal(false)}>✕</button>
            </div>
            <div className="text-xs text-gray-400 mb-2">We’ll use the last assistant message from the selected chat.</div>
            <div className="max-h-[50vh] overflow-y-auto space-y-2">
              {loadingChats && <div className="text-sm text-gray-400">Loading…</div>}
              {!loadingChats && (chats?.length ?? 0) === 0 && (
                <div className="text-sm text-gray-400">No chats yet.</div>
              )}
              {(chats || []).map((c) => (
                <div key={c._id} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                  <div className="truncate mr-3">{c.title || "Untitled chat"}</div>
                  <button
                    onClick={() => useLastAssistantFrom(c._id)}
                    className="px-3 py-1.5 rounded-md bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-sm disabled:opacity-60"
                    disabled={!!loadingPick}
                  >
                    {loadingPick === c._id ? "Picking…" : "Use this"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
