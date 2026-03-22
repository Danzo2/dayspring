import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Target,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  {
    label: "My Courses",
    icon: BookOpen,
    children: [{ label: "Applied Prompt Engineering", path: "/courses/prompt-engineering" }],
  },
  { label: "OpenClaw Tutor", icon: Bot, path: "/tutor" },
  { label: "Goals & Tracking", icon: Target, path: "/goals" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function DashboardSidebar() {
  const [coursesOpen, setCoursesOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const studiedHours = 2;
  const goalHours = 4;
  const progress = studiedHours / goalHours;
  const circumference = 2 * Math.PI * 36;

  const isActive = (path?: string) => path && location.pathname === path;

  return (
    <aside className="w-[260px] min-h-screen bg-surface-alt border-r border-border flex flex-col animate-slide-in-left">
      {/* Logo */}
      <div className="px-6 py-7 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-terracotta flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 6V14H2V6L8 2Z" fill="white" opacity="0.9" />
          </svg>
        </div>
        <span className="text-lg font-medium tracking-tight text-foreground">
          dayspring
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 mt-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            <button
              onClick={() => {
                if (item.children) {
                  setCoursesOpen(!coursesOpen);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-sanctuary
                ${
                  isActive(item.path)
                    ? "bg-sage-light text-sage-hover"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
            >
              <item.icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.children &&
                (coursesOpen ? (
                  <ChevronDown className="w-4 h-4 opacity-50" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-50" />
                ))}
            </button>
            {item.children && coursesOpen && (
              <div className="ml-9 mt-0.5 space-y-0.5">
                {item.children.map((child) => (
                  <button
                    key={child.label}
                    onClick={() => navigate(child.path)}
                    className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-sanctuary ${
                      isActive(child.path)
                        ? "text-sage-hover bg-sage-light/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Daily Focus Widget */}
      <div className="px-5 pb-3">
        <div className="bg-card rounded-xl p-4 shadow-card flex flex-col items-center gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Daily Focus
          </p>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" stroke="hsl(var(--border))" strokeWidth="5" fill="none" />
              <circle
                cx="40" cy="40" r="36"
                stroke="hsl(var(--sage))"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                className="transition-sanctuary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-semibold text-foreground">
                {studiedHours}/{goalHours}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">hours studied today</p>
        </div>
      </div>

      {/* User Card */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-card shadow-card border border-border/30">
          <div className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-sage-hover">DB</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Danny Bhaskaran</p>
            <p className="text-[11px] text-muted-foreground">Student</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
