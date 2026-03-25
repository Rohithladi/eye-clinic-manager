import { Button } from "@/components/ui/button";
import { BookOpen, Eye, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Link, useRouter } from "../router";

const navLinks = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/user-manual", icon: BookOpen, label: "User Manual" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { clear } = useInternetIdentity();
  const { path } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-sidebar text-sidebar-foreground">
        <SidebarContent path={path} onLogout={clear} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Enter" && setMobileOpen(false)}
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-sidebar text-sidebar-foreground flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent path={path} onLogout={clear} />
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-auto">
        {/* Top bar - mobile only */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <button
            type="button"
            data-ocid="nav.toggle"
            onClick={() => setMobileOpen(true)}
            className="text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">EyeClinic</span>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>

        <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
          &copy; {new Date().getFullYear()}. Built with &hearts; using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}

function SidebarContent({
  path,
  onLogout,
}: {
  path: string;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20">
          <Eye className="w-5 h-5 text-primary" />
        </div>
        <span className="font-bold text-base text-sidebar-foreground">
          EyeClinic
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <Button
          data-ocid="nav.logout.button"
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sm"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </>
  );
}
