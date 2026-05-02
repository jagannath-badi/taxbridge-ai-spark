import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type User = {
  name: string;
  email: string;
  country: string;
  profession?: string;
};

const SessionContext = createContext<{
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("tb_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("tb_user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("tb_user");
  };

  return <SessionContext.Provider value={{ user, login, logout }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
