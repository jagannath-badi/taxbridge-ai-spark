import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type User = {
  name: string;
  email: string;
  country: string;
  profession?: string;
};

type Ctx = {
  user: User | null;
  userId: string | null;
  loading: boolean;
  login: (u: User) => void; // legacy no-op for compatibility
  logout: () => Promise<void>;
};

const SessionContext = createContext<Ctx>({
  user: null,
  userId: null,
  loading: true,
  login: () => {},
  logout: async () => {},
});

async function loadProfile(id: string, fallbackEmail: string | undefined): Promise<User> {
  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, country, creator_type")
    .eq("id", id)
    .maybeSingle();
  return {
    name: data?.full_name || (fallbackEmail?.split("@")[0] ?? "Creator"),
    email: data?.email || fallbackEmail || "",
    country: data?.country || "Singapore",
    profession: data?.creator_type || "",
  };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setUser(null);
        setLoading(false);
        return;
      }
      // defer Supabase query to avoid deadlock
      setTimeout(async () => {
        const u = await loadProfile(uid, session?.user?.email ?? undefined);
        setUser(u);
        setLoading(false);
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const u = await loadProfile(uid, data.session?.user?.email ?? undefined);
        setUser(u);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserId(null);
  };

  return (
    <SessionContext.Provider value={{ user, userId, loading, login: () => {}, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
