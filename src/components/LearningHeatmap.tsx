import { useMemo } from "react";
import { Flame } from "lucide-react";
import { useLearningSessionsRange } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";

export function LearningHeatmap() {
  const weeks = 16;
  const days = 7;
  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

  const { data: sessions } = useLearningSessionsRange(weeks * 7);
  const { profile } = useAuth();
  const streak = (profile as any)?.current_streak ?? 0;

  // Build lookup of date -> total minutes
  const sessionMap = useMemo(() => {
    const map: Record<string, number> = {};
    sessions?.forEach((s) => {
      const d = s.activity_date ?? "";
      map[d] = (map[d] ?? 0) + s.duration_minutes;
    });
    return map;
  }, [sessions]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - weeks * 7);

    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + w * 7);
      const month = d.getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: d.toLocaleString("default", { month: "short" }),
          col: w,
        });
        lastMonth = month;
      }
    }
    return labels;
  }, []);

  const { data: gridData, maxMinutes } = useMemo(() => {
    const grid: { date: string; minutes: number }[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - weeks * 7);
    let maxMin = 1;

    for (let w = 0; w < weeks; w++) {
      const week: { date: string; minutes: number }[] = [];
      for (let d = 0; d < days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + w * 7 + d);
        const dateStr = date.toISOString().split("T")[0];
        const mins = sessionMap[dateStr] ?? 0;
        if (mins > maxMin) maxMin = mins;
        week.push({ date: dateStr, minutes: mins });
      }
      grid.push(week);
    }
    return { data: grid, maxMinutes: maxMin };
  }, [sessionMap]);

  const getColor = (minutes: number) => {
    if (minutes === 0) return "bg-muted/40";
    const ratio = minutes / maxMinutes;
    if (ratio < 0.25) return "bg-sage/20";
    if (ratio < 0.5) return "bg-sage/40";
    if (ratio < 0.75) return "bg-sage/60";
    return "bg-sage/80";
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30">
      <h3 className="text-sm font-medium text-foreground mb-3">
        Progress Heatmap
      </h3>

      {/* Month labels */}
      <div className="flex gap-[3px] ml-8 mb-1">
        {Array.from({ length: weeks }).map((_, wi) => {
          const label = monthLabels.find((m) => m.col === wi);
          return (
            <div key={wi} className="w-[14px] text-[10px] text-muted-foreground leading-none">
              {label ? label.label : ""}
            </div>
          );
        })}
      </div>

      {/* Grid with day labels */}
      <div className="flex gap-0">
        <div className="flex flex-col gap-[3px] mr-1.5 pt-0">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[14px] flex items-center">
              <span className="text-[10px] text-muted-foreground w-6 text-right">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {gridData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className={`w-[14px] h-[14px] rounded-[3px] ${getColor(cell.minutes)} transition-sanctuary`}
                  title={`${cell.date}: ${cell.minutes} min`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground ml-8">
        <span>Less</span>
        <div className="w-[14px] h-[14px] rounded-[3px] bg-muted/40" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/20" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/40" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/60" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/80" />
        <span>More</span>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
        <Flame className="w-4 h-4 text-terracotta" strokeWidth={1.8} />
        <div>
          <p className="text-xs font-medium text-foreground">{streak} Days</p>
          <p className="text-[11px] text-muted-foreground">Current Streak</p>
        </div>
      </div>
    </div>
  );
}
