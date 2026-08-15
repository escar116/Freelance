import { db } from "./mockDb";
import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import { 
  Menu, X, LogOut, Search, Home, FileText, ClipboardList, 
  MessageSquare, Banknote, Star, User as UserIcon, Settings,
  ChevronLeft, ChevronRight, ShieldAlert
} from "lucide-react";
import { Button } from "./button";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { label: "Dashboard", to: "/", icon: Home },
  { label: "Find Services", to: "/services", icon: Search },
  { label: "Service Requests", to: "/requests", icon: FileText },
  { label: "Applications", to: "#applications", icon: ClipboardList },
  { label: "Messages", to: "#messages", icon: MessageSquare },
  { label: "Transactions", to: "#transactions", icon: Banknote },
  { label: "Ratings", to: "#ratings", icon: Star },
  { label: "Profile", to: "/profile", icon: UserIcon },
  { label: "Settings", to: "#settings", icon: Settings },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.email === 'charlesjanparaggua@gmail.com';

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center shrink-0">
          <span className="text-xl font-bold tracking-tight text-primary">
            WORK <span className="text-secondary">4</span> A BIT
          </span>
        </Link>
        <button
          className="p-2 rounded-xl hover:bg-muted text-primary"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-card border-r border-border z-50 transition-all duration-300 flex flex-col
          ${sidebarWidth} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className={`h-16 flex items-center border-b border-border px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <Link to="/" className="flex items-center shrink-0 truncate">
              <span className="text-lg font-bold tracking-tight text-primary">
                WORK <span className="text-secondary">4</span> A BIT
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/" className="flex items-center shrink-0">
              <span className="text-xl font-bold tracking-tight text-primary">W<span className="text-secondary">4</span></span>
            </Link>
          )}
          
          {/* Mobile close button */}
          <button 
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
          {NAV.map((n) => {
            const isActive = location.pathname === n.to;
            return (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center h-10 px-3 rounded-xl transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? n.label : undefined}
              >
                <n.icon className={`w-5 h-5 shrink-0 ${!isCollapsed ? 'mr-3' : ''}`} />
                {!isCollapsed && <span className="text-sm truncate">{n.label}</span>}
              </Link>
            );
          })}
          
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center h-10 px-3 rounded-xl mt-2 transition-colors ${
                location.pathname === '/admin'
                  ? "bg-amber-100 text-amber-700 font-medium" 
                  : "text-amber-600 hover:bg-amber-50"
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? "Admin Dashboard" : undefined}
            >
              <ShieldAlert className={`w-5 h-5 shrink-0 ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && <span className="text-sm truncate">Admin</span>}
            </Link>
          )}
        </div>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && <span className="text-sm text-muted-foreground">Theme</span>}
            <ThemeToggle />
          </div>
          
          <button
            onClick={() => db.auth.logout("/login")}
            className={`flex items-center h-10 px-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={`w-5 h-5 shrink-0 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full items-center justify-center text-muted-foreground hover:text-foreground shadow-sm z-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 min-h-screen pt-16 lg:pt-0 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}