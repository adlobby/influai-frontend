// src/channels/registry.tsx
import { ChannelMeta } from "./types";
import YouTubeScriptForm, { YtValues } from "./YouTubeScriptForm";

// ---- Icons (inline) ----
const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.6 3.2c-3.6-.2-11.6-.2-15.2 0C.5 3.5 0 5.8 0 12s.5 8.5 4.4 8.8c3.6.2 11.6.2 15.2 0 3.9-.3 4.4-2.6 4.4-8.8s-.5-8.5-4.4-8.8zM8 16V8l8 4-8 4z" />
  </svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm6.406-1.521a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
  </svg>
);
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7 19H4V9h3v10zM5.5 7.73A1.73 1.73 0 1 1 5.5 4.27a1.73 1.73 0 0 1 0 3.46zM20 19h-3v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.74V19h-3V9h2.88v1.37h.04c.4-.75 1.37-1.54 2.82-1.54 3.02 0 3.58 1.99 3.58 4.58V19z"/>
  </svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2H21l-6.5 7.444L22 22h-6.9l-4.3-5.56L5.7 22H3l7.09-8.123L2 2h6.9l3.9 5.2L18.244 2Zm-2.4 18h1.86L8.3 4H6.35L15.844 20Z"/>
  </svg>
);
const DocIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V7h3.5L13 3.5zM8 9h8v2H8V9zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/>
  </svg>
);
const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14.7 3.3l-1 4.6c1.6.1 3 .6 4.1 1.3.5-.5 1.2-.8 2-.8 1.6 0 2.9 1.3 2.9 3 0 1.1-.6 2.1-1.5 2.6.1.4.1.8.1 1.2 0 3.1-3.8 5.6-8.5 5.6S3.4 18.3 3.4 15.2c0-.4 0-.8.1-1.2-.9-.5-1.5-1.5-1.5-2.6 0-1.7 1.3-3 2.9-3 .8 0 1.5.3 2 .8 1.1-.7 2.5-1.2 4.1-1.3l1-4.6 2.7.6zm-5.1 9.7c-.6 0-1.1.5-1.1 1.2s.5 1.2 1.1 1.2 1.1-.5 1.1-1.2-.5-1.2-1.1-1.2zm6.8 0c-.6 0-1.1.5-1.1 1.2s.5 1.2 1.1 1.2 1.1-.5 1.1-1.2-.5-1.2-1.1-1.2zM12 19.4c1.4 0 2.6-.5 3.5-1.2.3-.2.3-.6 0-.8-.2-.2-.6-.2-.8 0-.7.6-1.6.9-2.7.9s-2-.3-2.7-.9c-.2-.2-.6-.2-.8 0-.3.2-.3.6 0 .8.9.7 2.1 1.2 3.5 1.2z"/>
  </svg>
);

// ---- Form components (you can add the rest later) ----
import InstagramPostForm from "./InstagramPostForm";
import InstagramReelForm from "./InstagramReelForm";
import LinkedInPostForm from "./LinkedInPostForm";
import TwitterThreadForm from "./TwitterThreadForm";
import BlogArticleForm from "./BlogArticleForm";
import RedditPostForm from "./RedditPostForm";

// ---- Helpers ----
const addIf = (cond: any, line: string) => (cond ? [line] : []);
const researchLine = (on?: boolean) =>
  on ? ["Deep research: ground in reliable, current sources from our DB; synthesize into original prose."] : [];

// ---- YouTube script format (exact headings) ----
function ytFormat(values: YtValues) {
  const len = values.durationMin || 4;
  const tones = Array.isArray(values.tones) && values.tones.length
    ? `Tone: ${values.tones.join(" + ")}`
    : "";
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
    tones ? `- ${tones}.` : undefined,
  ].filter(Boolean).join("\n");
}

export const channelList: ChannelMeta[] = [
  {
    key: "yt_script",
    label: "YouTube Script",
    hint: "3–5 min script with hook & chapters",
    Icon: YouTubeIcon,
    Form: YouTubeScriptForm,
    buildTitle: (v: YtValues) =>
      `YouTube: ${String(v.niche || "Niche")}${v.topic ? " — " + String(v.topic).slice(0, 60) : ""}`,
    buildPrompt: (v: YtValues, opts) =>
      [
        "Act as a senior YouTube script writer.",
        ...addIf(v.niche, `Niche: ${v.niche}`),
        ...addIf(v.topic, `Topic/Brief: ${v.topic}`),
        ...addIf(v.audience, `Audience: ${v.audience}`),
        ...addIf(v.prompt, `Custom guidance: ${v.prompt}`),
        ytFormat(v),
        ...researchLine(opts?.deepResearch),
      ].join("\n\n"),
  },

  // You can wire the rest later; kept for completeness:
  { key: "insta_post", label: "Instagram Post", hint: "caption + hashtags", Icon: InstagramIcon, Form: InstagramPostForm,
    buildPrompt: (v) => ["Act as an IG copywriter.", ...addIf(v.topic, `Topic: ${v.topic}`), "Write a punchy caption."].join("\n") },
  { key: "insta_reel", label: "Instagram Reel", hint: "30–60s hook-first reel", Icon: InstagramIcon, Form: InstagramReelForm,
    buildPrompt: (v) => ["Write an IG Reel script.", ...addIf(v.topic, `Topic: ${v.topic}`)].join("\n") },
  { key: "linkedin", label: "LinkedIn Post", hint: "value-led post", Icon: LinkedInIcon, Form: LinkedInPostForm,
    buildPrompt: (v) => ["Write a value-led LinkedIn post.", ...addIf(v.topic, `Topic: ${v.topic}`)].join("\n") },
  { key: "x_post", label: "X (Twitter) Thread", hint: "concise thread", Icon: XIcon, Form: TwitterThreadForm,
    buildPrompt: (v) => ["Write an X thread.", ...addIf(v.topic, `Topic: ${v.topic}`)].join("\n") },
  { key: "blog", label: "Blog Article", hint: "outline + draft", Icon: DocIcon, Form: BlogArticleForm,
    buildPrompt: (v) => ["Write an outline + 1000-word draft.", ...addIf(v.topic, `Topic: ${v.topic}`)].join("\n") },
  { key: "reddit", label: "Reddit Post", hint: "story-first", Icon: RedditIcon, Form: RedditPostForm,
    buildPrompt: (v) => ["Write a friendly, story-first Reddit post.", ...addIf(v.topic, `Topic: ${v.topic}`)].join("\n") },
];

export const channelByKey = Object.fromEntries(channelList.map((c) => [c.key, c] as const));
