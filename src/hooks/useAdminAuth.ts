import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthState {
  loading: boolean;
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  fullName: string;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    user: null,
    session: null,
    isAdmin: false,
    fullName: "",
  });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({ ...s, session, user: session?.user ?? null }));
      if (session?.user) {
        setTimeout(() => loadRole(session.user.id), 0);
      } else {
        setState({ loading: false, user: null, session: null, isAdmin: false, fullName: "" });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState((s) => ({ ...s, session, user: session.user }));
        loadRole(session.user.id);
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadRole(userId: string) {
    const [{ data: roles }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    ]);
    const isAdmin = !!roles?.some((r) => r.role === "admin" || r.role === "operator");
    setState((s) => ({
      ...s,
      loading: false,
      isAdmin,
      fullName: profile?.full_name ?? "",
    }));
  }

  return state;
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}
