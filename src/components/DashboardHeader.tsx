import { Search, Bell } from "lucide-react";

interface DashboardHeaderProps {
  name: string;
  unitsRemaining: number;
}

export function DashboardHeader({ name, unitsRemaining }: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
      <div>
        <h1 className="text-2xl font-medium text-foreground">
          Welcome Back, {name}.
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          You have {unitsRemaining} units to complete this week. Stay focused.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-card rounded-lg px-3.5 py-2 shadow-card gap-2 border border-border/50">
          <Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground/60"
          />
        </div>
        <button className="w-9 h-9 rounded-lg bg-card shadow-card border border-border/50 flex items-center justify-center hover:shadow-card-hover transition-sanctuary active:scale-[0.97]">
          <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
