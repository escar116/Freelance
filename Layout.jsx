import { db } from "./mockDb";

import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import { Menu, X, LogOut, Search } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { SideTraces } from "./CircuitDecor";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Help Requests", to: "/requests" },
  { label: "Profile", to: "/profile" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = user?.email === 'charlesjanparaggua@gmail.com';

  const submitSearch = (e) => {
    e.preventDefault();
    setOpen(false);
    navigate("/search?q=" + encodeURIComponent(q));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div className="fixed inset-y-0 left-0 w-12 pointer-events-none z-0 hidden xl:block text-secondary opacity-[0.10]">
        <SideTraces />
      </div>
      <div className="fixed inset-y-0 right-0 w-12 pointer-events-none z-0 hidden xl:block text-secondary opacity-[0.10]">
        <SideTraces flip />
      </div>
      <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-primary">
              WORK <span className="text-secondary">4</span> A BIT
            </span>
          </Link>

          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-sm relative" role="search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search services, students, skills..."
              aria-label="Global search"
              className="pl-9 h-10 rounded-full bg-muted border-transparent focus-visible:bg-white"
            />
          </form>

          <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "px-3 py-2 text-sm rounded-full transition-colors " +
                  (location.pathname === n.to
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-primary hover:bg-muted")
                }
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={
                  "px-3 py-2 text-sm rounded-full transition-colors " +
                  (location.pathname === "/admin"
                    ? "bg-amber-100 text-amber-700 font-medium"
                    : "text-amber-600 hover:text-amber-700 hover:bg-amber-50")
                }
              >
                Admin
              </Link>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 text-muted-foreground hover:text-primary"
              onClick={() => db.auth.logout("/login")}
            >
              <LogOut className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Logout
            </Button>
          </nav>

          <button
            className="lg:hidden ml-auto p-2 rounded-xl hover:bg-muted text-primary"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/70 bg-background px-4 py-4 space-y-2 fade-up">
            <form onSubmit={submitSearch} className="relative md:hidden" role="search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                aria-label="Global search"
                className="pl-9 h-11 rounded-full bg-muted border-transparent"
              />
            </form>
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm text-primary hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm text-amber-600 hover:bg-amber-50"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => db.auth.logout("/login")}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <footer className="relative z-10 mt-20 bg-primary text-primary-foreground/80">
        <div className="max-w-7xl mx-auto px-6 py-10 text-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <span className="font-semibold text-primary-foreground">Work 4 a bit</span>
          <span>A verified marketplace for Computer Engineering students.</span>
        </div>
      </footer>
    </div>
  );
}