import { useState } from "react";
import { getSupabase } from "../lib/supabase-browser";

export default function AuthPage() {
  const supabase = getSupabase();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        // optional: store name in user metadata
        const { error } = await supabase.auth.signUp({
          email,
          password: pw,
          options: { data: name ? { full_name: name } : undefined },
        });
        if (error) throw error;
        // if email confirmations are ON, user must confirm; otherwise session exists
        const { data: s } = await supabase.auth.getSession();
        if (s.session) window.location.href = "/app";
        else setMsg("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        window.location.href = "/app";
      }
    } catch (err: any) {
      setMsg(err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider: "google" | "github") {
    setMsg(null);
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error; // normally redirects immediately
    } catch (e: any) {
      setMsg(e.message || "OAuth failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060C] to-[#0A0F1F] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] bg-clip-text text-transparent">CriptAi</span>
            <span className="text-gray-300"> by AdLobby</span>
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          <button type="button"
            className={`flex-1 py-2 rounded-lg ${mode === "signup" ? "bg-[#6C5CE7]" : "bg-white/10"}`}
            onClick={() => setMode("signup")}
          >Sign up</button>
          <button type="button"
            className={`flex-1 py-2 rounded-lg ${mode === "login" ? "bg-[#6C5CE7]" : "bg-white/10"}`}
            onClick={() => setMode("login")}
          >Log in</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <input
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0F1F] border border-white/10 rounded-lg px-4 py-3"
            />
          )}

          <input
            required type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0A0F1F] border border-white/10 rounded-lg px-4 py-3"
          />

          <input
            required type="password" placeholder="Password"
            value={pw} onChange={(e) => setPw(e.target.value)}
            className="w-full bg-[#0A0F1F] border border-white/10 rounded-lg px-4 py-3"
          />

          <button disabled={loading}
            className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00E5FF] py-3 rounded-lg disabled:opacity-60">
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
          </button>

          {msg && <p className="text-sm text-red-400">{msg}</p>}
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 text-xs uppercase tracking-wider text-gray-400 bg-transparent">
                or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => oauth("google")}
              className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-4 py-2"
              disabled={loading}>
              <span>G</span> Google
            </button>
            <button type="button" onClick={() => oauth("github")}
              className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg px-4 py-2"
              disabled={loading}>
              <span></span> GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
