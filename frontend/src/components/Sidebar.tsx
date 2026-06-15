import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Building2, 
  CreditCard, 
  FileText, 
  ClipboardList, 
  Bell, 
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
  }[];
}

export function Sidebar({ items }: SidebarProps) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Building2 className="h-6 w-6" />
          <span>El Mirador</span>
        </Link>
        {user && (
          <p className="text-sm text-muted-foreground mt-2 truncate">
            {user.nombre}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {items.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                data-testid={`sidebar-link-${item.title.toLowerCase()}`}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
          data-testid="sidebar-button-logout"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-card fixed left-0 top-0">
        <SidebarContent />
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background flex items-center px-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg">El Mirador</span>
      </div>
    </>
  );
}
