import { Link, useLocation } from "wouter";
import { Building2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const isDashboard = location !== "/" && location !== "/login";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary" data-testid="link-home">
          <Building2 className="h-6 w-6" />
          <span>El Mirador</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            data-testid="button-theme-toggle"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!isDashboard && !user && (
            <Link href="/login" data-testid="link-login">
              <Button>Iniciar sesión</Button>
            </Link>
          )}

          {!isDashboard && user && (
            <Link href={user.redirectTo} data-testid="link-dashboard">
              <Button>Ir a mi cuenta</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
