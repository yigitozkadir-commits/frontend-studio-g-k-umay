// ============================================================
// AI Frontend Studio — Component Registry
// Bileşen: Dashboard Sidebar + Header
// Kullanılan araçlar: shadcn/ui (15), Zustand (35), Lucide (105), next-themes (199)
// ============================================================
"use client";

import { useUIStore } from "@/snippets/state-management";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard, Users, ShoppingCart, BarChart3, Settings,
  Bell, Search, Menu, Sun, Moon, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kullanıcılar", href: "/dashboard/users", icon: Users, badge: "12" },
  { label: "Siparişler", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Analitik", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Ayarlar", href: "/dashboard/settings", icon: Settings },
];

// ----------------------------------------------------------
// SIDEBAR
// ----------------------------------------------------------
export function DashboardSidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-background transition-all duration-300",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg shrink-0" />
          {sidebarOpen && (
            <span className="font-bold text-lg truncate">Studio</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs h-5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            return sidebarOpen ? (
              <div key={item.href}>{linkContent}</div>
            ) : (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse Butonu */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

// ----------------------------------------------------------
// HEADER
// ----------------------------------------------------------
export function DashboardHeader({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b flex items-center px-6 gap-4 bg-background">
      {/* Mobil Menü */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <MobileSidebar />
        </SheetContent>
      </Sheet>

      <h1 className="font-semibold text-lg flex-1">{title}</h1>

      {/* Arama */}
      <Button variant="outline" size="sm" className="hidden sm:flex gap-2 text-muted-foreground">
        <Search className="w-3.5 h-3.5" />
        <span className="text-xs">Ara...</span>
        <kbd className="text-xs bg-muted px-1.5 rounded">⌘K</kbd>
      </Button>

      {/* Tema */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* Bildirimler */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </Button>

      {/* Kullanıcı */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Ayarlar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500">
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

// Mobil Sidebar (Sheet içinde)
function MobileSidebar() {
  const pathname = usePathname();
  return (
    <nav className="p-4 space-y-1 mt-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
