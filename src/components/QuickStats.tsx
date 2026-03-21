import { TrendingUp, Calendar, BookCheck } from "lucide-react";

export function QuickStats() {
  const stats = [
    { label: "Weekly Average", value: "4.2h", icon: TrendingUp, color: "text-sage" },
    { label: "Next Deadline", value: "Mar 28", icon: Calendar, color: "text-terracotta" },
    { label: "Completed", value: "14 Lessons", icon: BookCheck, color: "text-sage" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: "400ms" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-5 shadow-card border border-border/30 flex items-center gap-4 hover:shadow-card-hover transition-sanctuary cursor-pointer active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center">
            <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-lg font-semibold font-mono text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
