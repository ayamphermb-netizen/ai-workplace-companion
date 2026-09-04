import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  NotebookPen,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/assistant", label: "AI Workplace Assistant", icon: MessageSquare },
  { to: "/activity", label: "Recent Activity", icon: Activity },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
        <Sparkles className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-foreground">AI Workplace</span>
        <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
      </span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className={cn("size-4 shrink-0", active && "text-primary")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Brand />
        <div className="mt-8 flex-1">
          <NavLinks />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Session-only workspace. Nothing you enter is stored.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Brand />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[17rem] bg-sidebar px-4 py-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Brand />
              <div className="mt-8">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
