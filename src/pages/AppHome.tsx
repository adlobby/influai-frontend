import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "./AppHome.module.css";

import { getSupabase } from "../lib/supabase-browser";
import { channelList, channelByKey } from "../channels/registry";
import type { TemplateKey } from "../channels/types";

type Chat = {
  _id: string;
  title: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};
type Message = {
  _id: string;
  chatId: string;
  userId?: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
  usedModel?: string;
};
type LeftMode = "channels" | "chats";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";
const API_ROOT = API_BASE.replace(/\/api\/?$/, "");

const LS_SELECTED = "ui.selectedChannel";
const LS_LEFTMODE = "ui.leftMode";
const LS_ACTIVE_CHAT = "chat.activeId";

function toLocalChat(input: any): Chat {
  if (!input) return { _id: "", title: "" };
  return {
    _id: input._id || input.id,
    title: input.title,
    userId: input.userId,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}
function toLocalMessage(input: any): Message {
  return {
    _id: input._id || input.id,
    chatId: input.chatId,
    userId: input.userId,
    role: input.role,
    content: input.content,
    createdAt: input.createdAt,
    usedModel: input.usedModel || input.used_model,
  };
}
function normalizeChats(data: any): Chat[] {
  const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return arr.map(toLocalChat);
}
function normalizeMessages(data: any): Message[] {
  if (Array.isArray(data)) return data.map(toLocalMessage);
  if (Array.isArray(data?.data)) return data.data.map(toLocalMessage);
  if (data && (data.id || data._id)) return [toLocalMessage(data)];
  return [];
}

function normalizeHeadingsAndBadges(text: string) {
  let t = (text || "")
    .replace(/^###\s*H1:\s*/gm, "# ")
    .replace(/^###\s*H2:\s*/gm, "## ")
    .replace(/^H1:\s*/gm, "# ")
    .replace(/^H2:\s*/gm, "## ")
    .replace(/^\s*---\s*$/gm, "\n");
  t = t.replace(/\[(\d{1,2}:\d{2})]/g, (_m, mm) => `<span class="ts">[${mm}]</span>`);
  return t;
}

function ModelBadge({ model }: { model?: string }) {
  if (!model) return null;
  const m = (model || "").toLowerCase();
  const isZai = m.includes("zai");
  const isMistral = m.includes("mistral");
  const letter = isZai ? "z" : isMistral ? "M" : "?";
  return (
    <span
      title={model}
      className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-white/20 text-[10px] font-bold leading-none bg-[#6C5CE7] text-white/95"
      style={{ transform: "translateY(-0.5px)" }}
    >
      {letter}
    </span>
  );
}

export default function AppHome() {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(() =>
    localStorage.getItem(LS_ACTIVE_CHAT)
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  const [leftMode, setLeftMode] = useState<LeftMode>(
    () => (localStorage.getItem(LS_LEFTMODE) as LeftMode) || "channels"
  );
  const [selectedKey, setSelectedKey] = useState<TemplateKey | null>(
    () => (localStorage.getItem(LS_SELECTED) as TemplateKey) || null
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const [editUI, setEditUI] = useState<{
    open: boolean;
    x: number;
    y: number;
    messageId?: string;
    selected?: string;
    instruction?: string;
  }>({ open: false, x: 0, y: 0 });

  useEffect(() => {
    (async () => {
      const ses = await supabase?.auth.getSession();
      const email = ses?.data.session?.user.email;
      if (email) setUserEmail(email);
    })();
  }, [supabase]);

  useEffect(() => {
    selectedKey
      ? localStorage.setItem(LS_SELECTED, selectedKey)
      : localStorage.removeItem(LS_SELECTED);
  }, [selectedKey]);
  useEffect(() => {
    localStorage.setItem(LS_LEFTMODE, leftMode);
  }, [leftMode]);
  useEffect(() => {
    activeId
      ? localStorage.setItem(LS_ACTIVE_CHAT, activeId)
      : localStorage.removeItem(LS_ACTIVE_CHAT);
  }, [activeId]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const listRaw = await authedFetch<any>(`${API_BASE}/chats`);
        const list = normalizeChats(listRaw);
        setChats(list);
        if (!activeId && list.length) setActiveId(list[0]._id);
      } catch (e: any) {
        setError(e.message || "Failed to load chats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    (async () => {
      try {
        setError(null);
        const raw = await authedFetch<any>(`${API_BASE}/chats/${activeId}/messages`);
        const list = normalizeMessages(raw);
        setMessages(list);
        setTimeout(() => scrollRef.current?.scrollTo(0, 10 ** 9), 0);
      } catch (e: any) {
        setError(e.message || "Failed to load messages");
      }
    })();
  }, [activeId]);

  function pickChannel(key: TemplateKey) {
    setSelectedKey(key);
    setLeftMode("channels");
  }

  async function startNewChat(customTitle?: string) {
    try {
      setError(null);
      const createdRaw = await authedFetch<any>(`${API_BASE}/chats`, {
        method: "POST",
        body: JSON.stringify({ title: customTitle || "New chat" }),
      });
      const created = toLocalChat(createdRaw);
      if (!created._id) throw new Error("Chat create failed: missing id");
      setChats((c) => [created, ...c]);
      setActiveId(created._id);
      setMessages([]);
      return created;
    } catch (e: any) {
      setError(e.message || "Failed to create chat");
      return null;
    }
  }

  async function deleteChat(id: string) {
    if (!confirm("Delete this chat?")) return;
    try {
      // Try path style first
      await authedFetch(`${API_BASE}/chats/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // Fallback to query style (older backends)
      await authedFetch(`${API_BASE}/chats?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    }
    setChats((prev) => {
      const updated = prev.filter((x) => x._id !== id);
      if (activeId === id) {
        const next = updated[0];
        setActiveId(next ? next._id : null);
        setMessages([]);
      }
      return updated;
    });
  }

  async function send() {
    if (!activeId) {
      const created = await startNewChat();
      if (!created) return;
    }
    const chatId = activeId || chats[0]?._id;
    if (!chatId) return;

    const content = draft.trim();
    if (!content) return;

    setDraft("");
    setSending(true);

    try {
      await authedFetch<any>(`${API_BASE}/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      const rawList = await authedFetch<any>(`${API_BASE}/chats/${chatId}/messages`);
      setMessages(normalizeMessages(rawList));
      setTimeout(() => scrollRef.current?.scrollTo(0, 10 ** 9), 0);

      const rawChats = await authedFetch<any>(`${API_BASE}/chats`);
      setChats(normalizeChats(rawChats));
      setActiveId(chatId);
    } catch (e: any) {
      setError(e.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  async function signOut() {
    await supabase?.auth.signOut();
    window.location.href = "/auth";
  }

  const activeChat = useMemo(
    () => (Array.isArray(chats) ? chats.find((c) => c._id === activeId) || null : null),
    [chats, activeId]
  );

  const meta = selectedKey ? channelByKey[selectedKey] : null;
  const FormComp = meta?.Form;

  function onBubbleContextMenu(e: React.MouseEvent, message: Message) {
    if (message.role !== "assistant") return;
    const selection = window.getSelection()?.toString() || "";
    if (!selection.trim()) return;
    e.preventDefault();
    setEditUI({
      open: true,
      x: e.clientX,
      y: e.clientY - 8,
      messageId: message._id,
      selected: selection,
      instruction: "",
    });
  }

  async function runParagraphEdit() {
    if (!editUI.open || !editUI.messageId || !editUI.selected || !editUI.instruction) {
      setEditUI((s) => ({ ...s, open: false }));
      return;
    }
    try {
      const msg = messages.find((m) => m._id === editUI.messageId);
      if (!msg) return;

      const res = await authedFetch<{ text: string; used_model?: string }>(
        `${API_ROOT}/edit-paragraph`,
        {
          method: "POST",
          body: JSON.stringify({
            paragraph: editUI.selected,
            instruction: editUI.instruction,
            full_context: msg.content,
          }),
        }
      );

      const rewritten = (res as any).text || editUI.selected!;
      const updated = (msg.content || "").replace(editUI.selected!, rewritten);
      setMessages((arr) => arr.map((m) => (m._id === msg._id ? { ...m, content: updated } : m)));
      setEditUI((s) => ({ ...s, open: false }));
    } catch (e: any) {
      setError(e.message || "Failed to regenerate paragraph");
      setEditUI((s) => ({ ...s, open: false }));
    }
  }

  return (
    <div className="h-screen overflow-hidden flex bg-gradient-to-br from-[#05060C] to-[#0A0F1F] text-white">
      {/* Sidebar */}
      <aside className="w-72 h-full border-r border-white/10 p-4 hidden md:flex flex-col overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">
              <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">CriptAi</span>{" "}
              <span className="text-gray-300">by AdLobby</span>
            </div>
            <button
              onClick={() => {
                setSelectedKey(null);
                setLeftMode("channels");
              }}
              className="px-3 py-1 text-sm rounded-lg bg-white/10 hover:bg-white/15"
            >
              + New
            </button>
          </div>
        </div>

        <div className="text-xs uppercase tracking-wider text-gray-400 mt-1 mb-2">
          {leftMode === "channels" ? "Quick Channels" : "Chats"}
        </div>

        {leftMode === "channels" ? (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {channelList.map((t) => (
              <button
                key={t.key}
                onClick={() => pickChannel(t.key)}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                title={t.hint}
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/80">
                    <t.Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-gray-400">{t.hint}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto space-y-1">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
              ))}

            {!loading && chats.length === 0 && <p className="text-sm text-gray-400">No chats yet.</p>}

            {chats.map((c) => (
              <button
                key={c._id}
                onClick={() => {
                  setSelectedKey(null);
                  setActiveId(c._id);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  c._id === activeId ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="truncate">{c.title || "Untitled chat"}</span>
                <span
                  className="text-gray-400 hover:text-red-400 px-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(c._id);
                  }}
                  title="Delete chat"
                >
                  ✕
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/10 text-sm text-gray-300">
          <div className="truncate">{userEmail}</div>
          <button className="mt-2 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 h-full min-h-0 flex flex-col">
        <header className="md:hidden p-3 border-b border-white/10 flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedKey(null);
              setLeftMode("channels");
            }}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
          >
            + New
          </button>
          <div className="font-semibold truncate">{activeChat ? activeChat.title : "CriptAi"}</div>
        </header>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8">
          {selectedKey && channelByKey[selectedKey]?.Form ? (
            <FormHost
              key={selectedKey}
              metaKey={selectedKey}
              startNewChat={startNewChat}
              setSending={setSending}
              setError={setError}
              setSelectedKey={setSelectedKey}
              setLeftMode={setLeftMode}
              setMessages={setMessages}
              setChats={setChats}
              scrollRef={scrollRef}
            />
          ) : !activeId && !loading && messages.length === 0 ? (
            <WelcomeCanvas />
          ) : (
            <div className="space-y-4">
              {messages
                .filter((m) => m.role === "assistant")
                .map((m) => (
                  <Bubble key={m._id} message={m} onContextMenu={onBubbleContextMenu} />
                ))}
              {error && <div className="text-red-400 text-sm bg-white/5 p-3 rounded-lg">{error}</div>}
            </div>
          )}
        </div>

        {!selectedKey && (activeId || messages.length > 0) && (
          <div className="p-4 md:p-6 border-t border-white/10">
            <div className="max-w-4xl mx-auto flex gap-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask CriptAi anything…"
                rows={1}
                className="flex-1 resize-none rounded-xl bg-[#0A0F1F] border border-white/10 px-4 py-3 focus:outline-none focus:border-[#6C5CE7]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button
                disabled={sending || !draft.trim()}
                onClick={send}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              CriptAi may generate inaccurate information—verify important details.
            </p>
          </div>
        )}

        {editUI.open && (
          <div
            className="fixed z-50 w-[min(640px,calc(100vw-32px))] p-3 rounded-xl border border-white/10 bg-[#0A0F1F] shadow-lg"
            style={{ left: Math.max(8, editUI.x - 220), top: Math.max(8, editUI.y) }}
          >
            <div className="text-xs text-gray-400 mb-2">Regenerate selected paragraph</div>
            <input
              value={editUI.instruction || ""}
              onChange={(e) => setEditUI((s) => ({ ...s, instruction: e.target.value }))}
              placeholder="Describe how to change this paragraph…"
              className="w-full bg-[#0A0F1F] border border-white/10 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-[#6C5CE7]"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
                onClick={() => setEditUI((s) => ({ ...s, open: false }))}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] text-sm"
                onClick={runParagraphEdit}
              >
                Generate
              </button>
            </div>
          </div>
        )}
      </main>

      {sending && <GeneratingOverlay label="Generating your script…" />}
    </div>
  );
}

function FormHost({
  metaKey,
  startNewChat,
  setSending,
  setError,
  setSelectedKey,
  setLeftMode,
  setMessages,
  setChats,
  scrollRef,
}: any) {
  const meta = channelByKey[metaKey]!;
  const FormComp = meta.Form!;
  return (
    <FormComp
      onCancel={() => setSelectedKey(null)}
      onGenerate={async (values: Record<string, any>, options: { deepResearch?: boolean } = {}) => {
        const title =
          (meta.buildTitle ? meta.buildTitle(values) : `${meta.label}: ${String(values.topic || "").slice(0, 80)}`) ||
          meta.label;

        const created = await startNewChat(title);
        if (!created) return;

        const prompt = meta.buildPrompt(values, options);
        setSending(true);

        try {
          if (options.deepResearch) {
            const body = {
              niche: String(values.niche ?? ""),
              topic: String(values.topic ?? ""),
              audience: String(values.audience ?? ""),
              durationMin: Number(values.durationMin ?? values.duration ?? values.minutes ?? 4) || 4,
              tone:
                typeof values.tone === "string"
                  ? values.tone
                  : Array.isArray(values.tones)
                  ? values.tones.join(" + ")
                  : "",
              prompt: String(values.customPrompt ?? values.prompt ?? ""),
              deepResearch: true,
              hooksCount: Number(values.hooksCount ?? 1),
            };

            const res = await authedFetch<{ text: string; used_model?: string }>(
              `${API_ROOT}/research-generate/yt_script`,
              { method: "POST", body: JSON.stringify(body) }
            );

            await authedFetch(`${API_BASE}/chats/${created._id}/messages`, {
              method: "POST",
              body: JSON.stringify({ content: prompt, role: "user" }),
            });
            await authedFetch(`${API_BASE}/chats/${created._id}/messages`, {
              method: "POST",
              body: JSON.stringify({
                content: res.text,
                role: "assistant",
                usedModel: res.used_model || undefined,
              }),
            });

            const rawList = await authedFetch<any>(`${API_BASE}/chats/${created._id}/messages`);
            setMessages(normalizeMessages(rawList));
          } else {
            await authedFetch<any>(`${API_BASE}/chats/${created._id}/messages`, {
              method: "POST",
              body: JSON.stringify({ content: prompt }),
            });
            const rawList = await authedFetch<any>(`${API_BASE}/chats/${created._id}/messages`);
            setMessages(normalizeMessages(rawList));
          }

          setSelectedKey(null);
          setLeftMode("chats");
          setTimeout(() => scrollRef.current?.scrollTo(0, 10 ** 9), 0);

          const raw = await authedFetch<any>(`${API_BASE}/chats`);
          setChats(normalizeChats(raw));
        } catch (e: any) {
          setError(e.message || "Failed to generate");
        } finally {
          setSending(false);
        }
      }}
    />
  );
}

function Bubble({
  message,
  onContextMenu,
}: {
  message: Message;
  onContextMenu?: (e: React.MouseEvent, m: Message) => void;
}) {
  const content = normalizeHeadingsAndBadges(message.content || "");
  return (
    <div
      onContextMenu={(e) => onContextMenu?.(e, message)}
      className="max-w-3xl mx-auto rounded-2xl p-4 md:p-5 border bg-white/5 border-[#6C5CE7]/30"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-2 text-gray-400">
        CriptAi <ModelBadge model={message.usedModel} />
      </div>
      <div className={styles.proseWrap}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function WelcomeCanvas() {
  return (
    <div className="min-h-[75vh] grid place-items-center">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-sm text-gray-400 mb-2">Start a new chat to begin.</div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">Welcome</span>{" "}
          to CriptAi by AdLobby
        </h1>
        <p className="text-gray-300">
          Pick a channel on the left, fill in the brief, and click <span className="font-semibold">Start generating</span>. We’ll tailor the copy
          for the platform automatically.
        </p>
      </div>
    </div>
  );
}

function GeneratingOverlay({ label }: { label: string }) {
  const tiles = new Array(24).fill(0);
  return (
    <div className={styles.genOverlay}>
      <div className="flex flex-col items-center">
        <div className={styles.grid}>
          {tiles.map((_, i) => (
            <div key={i} className={`${styles.tile} ${i % 3 === 0 ? styles.tileDim : ""}`} />
          ))}
        </div>
        <div className={styles.genText}>{label}</div>
      </div>
    </div>
  );
}

async function authedFetch<T = any>(url: string, init: RequestInit = {}): Promise<T> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = (await supabase?.auth.getSession()) || { data: { session: null as any } };

  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json");
  if (session?.access_token) headers.set("authorization", `Bearer ${session.access_token}`);

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}
  if (!res.ok) throw new Error(json?.error || res.statusText);
  return (json as T) ?? ({} as T);
}
