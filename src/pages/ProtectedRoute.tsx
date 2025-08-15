import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSupabase } from "../lib/supabase-browser";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();
  const supabase = getSupabase();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setAuthed(!!data.session);
        setLoading(false);
      }
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!mounted) return;
        setAuthed(!!session);
      });
      return () => sub.subscription.unsubscribe();
    })();
    return () => { mounted = false; };
  }, [supabase]);

  if (loading) return null;

  if (!authed) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?next=${next}`} replace />;
  }

  return <Outlet />;
}
