// src/channels/InstagramPostForm.tsx
import { useState } from "react";
import type { ChannelFormProps } from "./types";

type Values = { topic: string; audience: string; tone: string; hashtags: string };

export default function InstagramPostForm({ onCancel, onGenerate }: ChannelFormProps<Values>) {
  const [v, setV] = useState<Values>({ topic: "", audience: "", tone: "casual", hashtags: "" });
  const [deepResearch, setDeepResearch] = useState(false);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onGenerate(v, { deepResearch }); }}
      className="max-w-3xl mx-auto p-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-2">Instagram Post</h2>
      {/* …inputs similar to YT (topic, audience, tone, hashtags)… */}
      <label className="inline-flex items-center gap-2 text-sm text-gray-300">
        <input type="checkbox" className="accent-[#6C5CE7]"
          checked={deepResearch} onChange={(e) => setDeepResearch(e.target.checked)} />
        Deep research
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">Cancel</button>
        <button type="submit"
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF]">Start generating</button>
      </div>
    </form>
  );
}
