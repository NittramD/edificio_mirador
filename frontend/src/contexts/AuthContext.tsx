import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { navigate } from "wouter/use-browser-location";

export type Role = "admin" | "owner" | "tenant" | "maintenance";

export interface User {
  email: string;
  nombre: string;
  role: Role;
  redirectTo: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const MOCK_USERS = [
  { email: 'admin@mirador.cl', password: 'admin123', role: 'admin' as Role, nombre: 'Administrador', redirectTo: '/admin' },
  { email: 'propietario@mirador.cl', password: 'prop123', role: 'owner' as Role, nombre: 'Carlos Mendoza', redirectTo: '/owner' },
  { email: 'arrendatario@mirador.cl', password: 'arr123', role: 'tenant' as Role, nombre: 'María González', redirectTo: '/tenant' },
  { email: 'mantencion@mirador.cl', password: 'mant123', role: 'maintenance' as Role, nombre: 'Pedro Díaz', redirectTo: '/maintenance' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("el-mirador-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("el-mirador-user");
      }
    }
  }, []);

  const login = (email: string, password: string) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userInfo } = found;
      setUser(userInfo);
      localStorage.setItem("el-mirador-user", JSON.stringify(userInfo));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("el-mirador-user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
