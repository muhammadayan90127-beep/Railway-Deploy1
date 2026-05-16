import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

const ADMIN_TOKEN_KEY = "mh_admin_token";

interface AdminCtx {
  isAdmin: boolean;
  adminToken: string | null;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminCtx | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const queryClient = useQueryClient();

  const adminLogin = useCallback((token: string) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    setAdminToken(token);
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AdminContext.Provider value={{ isAdmin: !!adminToken, adminToken, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
