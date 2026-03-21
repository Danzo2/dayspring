import { useMemo } from "react";
import { Flame, Clock } from "lucide-react";

export function LearningHeatmap() {
  const weeks = 26;
  const days = 7;
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const data = useMemo(() => {
    const grid: number[][] = [];
    for (let w = 0; w < weeks; w++) {
      const week: number[] = [];
      for (let d = 0; d < days; d++) {
        // Generate organic-looking data with streaks
        const base = Math.random();
        const weekendBoost = d >= 5 ? 0.2 : 0;
        const recentBoost = w > 20 ? 0.3 : 0;
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
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30 h-full">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Progress Heatmap
      </h3>
      <div className="flex gap-[3px]">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((val, di) => (
              <div
                key={di}
                className={`w-[14px] h-[14px] rounded-[3px] ${getColor(val)} transition-sanctuary`}
                title={`${dayLabels[di]}, week ${wi + 1}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground">
        <span>Less</span>
        <div className="w-[14px] h-[14px] rounded-[3px] bg-muted/40" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/20" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/40" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/60" />
        <div className="w-[14px] h-[14px] rounded-[3px] bg-sage/80" />
        <span>More</span>
      </div>
      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-terracotta" strokeWidth={1.8} />
          <div>
            <p className="text-xs font-medium text-foreground">12 Days</p>
            <p className="text-[11px] text-muted-foreground">Current Streak</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sage" strokeWidth={1.8} />
          <div>
            <p className="text-xs font-medium text-foreground">~6 hours</p>
            <p className="text-[11px] text-muted-foreground">Time to Mastery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
