// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase-browser";
import { getSafeNext } from "../lib/safe-next";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const supabase = getSupabase();
      if (!supabase) {
        if (!disposed) navigate("/auth", { replace: true });
        return;
      }

      const url = new URL(window.location.href);
      const next = getSafeNext(url.searchParams.get("next"), "/app");
      const code = url.searchParams.get("code");
      const providerErr =
        url.searchParams.get("error") || url.searchParams.get("error_description");
      const hash = window.location.hash || "";

      if (providerErr) {
        console.error("OAuth error:", providerErr);
        if (!disposed) navigate("/auth", { replace: true });
        return;
      }

      // already signed in?
      {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (!disposed) navigate(next, { replace: true });
          return;
        }
      }

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // clean query
          const cleaned = new URL(window.location.href);
          cleaned.searchParams.delete("code");
          cleaned.searchParams.delete("state");
          window.history.replaceState({}, "", cleaned.pathname + cleaned.search);

          if (!disposed) navigate(next, { replace: true });
          return;
        }

        if (hash.includes("access_token=")) {
          const params = new URLSearchParams(hash.slice(1));
          const access_token = params.get("access_token") ?? undefined;
          const refresh_token = params.get("refresh_token") ?? undefined;

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;

            window.history.replaceState({}, "", url.pathname + url.search);
            if (!disposed) navigate(next, { replace: true });
            return;
          }
        }

        const fallback = setTimeout(async () => {
          if (disposed) return;
          const { data: { session } } = await supabase.auth.getSession();
          if (session) navigate(next, { replace: true });
          else navigate("/auth", { replace: true });
        }, 1500);

        const { data } = supabase.auth.onAuthStateChange((_e, session) => {
          if (disposed) return;
          if (session) {
            clearTimeout(fallback);
            navigate(next, { replace: true });
          }
        });
        unsubscribe = () => data.subscription.unsubscribe();
      } catch (err: any) {
        console.error("Auth callback error:", err?.message || err);
        if (!disposed) navigate("/auth", { replace: true });
      }
    })();

    return () => {
      disposed = true;
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  return <div className="p-6 text-white/80">Signing you in…</div>;
}
