import { useMemo } from "react";
import { Flame } from "lucide-react";

export function LearningHeatmap() {
  const weeks = 16;
  const days = 7;
  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

  // Generate month labels for the columns
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

  const data = useMemo(() => {
    const grid: number[][] = [];
    for (let w = 0; w < weeks; w++) {
      const week: number[] = [];
      for (let d = 0; d < days; d++) {
        const base = Math.random();
        const weekendBoost = d >= 5 ? 0.2 : 0;
        const recentBoost = w > 12 ? 0.3 : 0;
        week.push(Math.min(1, base * 0.7 + weekendBoost + recentBoost));
      }
      grid.push(week);
    }
    return grid;
  }, []);

  const getColor = (val: number) => {
    if (val < 0.1) return "bg-muted/40";
    if (val < 0.3) return "bg-sage/20";
    if (val < 0.5) return "bg-sage/40";
    if (val < 0.7) return "bg-sage/60";
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
          {data.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((val, di) => (
                <div
                  key={di}
                  className={`w-[14px] h-[14px] rounded-[3px] ${getColor(val)} transition-sanctuary`}
                  title={`${dayLabels[di] || "Day"}, week ${wi + 1}`}
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
          <p className="text-xs font-medium text-foreground">12 Days</p>
          <p className="text-[11px] text-muted-foreground">Current Streak</p>
        </div>
      </div>
    </div>
  );
}
