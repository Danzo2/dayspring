import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Target,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  {
    label: "My Courses",
    icon: BookOpen,
    children: [{ label: "Applied Prompt Engineering" }],
  },
  { label: "OpenClaw Tutor", icon: Bot },
  { label: "Goals & Tracking", icon: Target },
  { label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const [coursesOpen, setCoursesOpen] = useState(true);
  const studiedHours = 2;
  const goalHours = 4;
  const progress = studiedHours / goalHours;
  const circumference = 2 * Math.PI * 36;

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
              onClick={() => item.children && setCoursesOpen(!coursesOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-sanctuary
                ${
                  item.active
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
                    className="w-full text-left px-3 py-2 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-sanctuary"
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
      <div className="px-5 pb-6">
        <div className="bg-card rounded-xl p-5 shadow-card flex flex-col items-center gap-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Daily Focus
          </p>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="hsl(var(--border))"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
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
              <span className="text-lg font-semibold text-foreground font-mono">
                {studiedHours}/{goalHours}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">hours studied today</p>
        </div>
      </div>
    </aside>
  );
}
