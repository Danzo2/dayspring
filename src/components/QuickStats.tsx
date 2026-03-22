import { TrendingUp, Clock, BookCheck } from "lucide-react";
import { useLearningSessionsRange, useSectionStats } from "@/hooks/useDashboardData";

export function QuickStats() {
  const { data: sectionStats } = useSectionStats();
  const { data: sessions } = useLearningSessionsRange(7);

  const weeklyMinutes = sessions?.reduce((s, r) => s + r.duration_minutes, 0) ?? 0;
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);

  const minRemaining = sectionStats?.remainingMinutes ?? 0;
  const hrsRemaining = sectionStats
    ? (minRemaining > 0 ? `~${Math.ceil(minRemaining / 60)} hours` : "0 hours")
    : "—";
  const totalCompleted = sectionStats?.completedSections ?? 0;

  const stats = [
    { label: "Weekly Average", value: `${weeklyHours}h`, icon: TrendingUp, color: "text-sage" },
    { label: "Next Unit Mastery", value: hrsRemaining, icon: Clock, color: "text-terracotta" },
    { label: "Completed", value: `${totalCompleted} Sections`, icon: BookCheck, color: "text-sage" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-5 shadow-card border border-border/30 flex items-center gap-4 hover:shadow-card-hover transition-sanctuary cursor-pointer active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center">
            <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
