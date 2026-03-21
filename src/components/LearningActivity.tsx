import { useMemo } from "react";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface BarData {
  day: string;
  segments: { value: number; color: string }[];
}

const courseColors = [
  "bg-sage/60",
  "bg-terracotta/50",
  "bg-sage/30",
];

export function LearningActivity() {
  const data: BarData[] = useMemo(() => {
    return dayLabels.map((day) => ({
      day,
      segments: [
        { value: Math.random() * 4 + 1, color: courseColors[0] },
        { value: Math.random() * 3 + 0.5, color: courseColors[1] },
        { value: Math.random() * 2, color: courseColors[2] },
      ],
    }));
  }, []);

  const maxVal = Math.max(
    ...data.map((d) => d.segments.reduce((s, seg) => s + seg.value, 0))
  );
  const yTicks = [0, 2, 4, 6, 8].filter((t) => t <= Math.ceil(maxVal) + 1);
  const chartHeight = 160;

  const totalHours = data.reduce(
    (sum, d) => sum + d.segments.reduce((s, seg) => s + seg.value, 0),
    0
  );
  const totalMins = Math.round(totalHours * 60);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  const courses = [
    { name: "Advanced Prompt Eng.", hours: "16", color: "bg-sage/60" },
    { name: "UX Research Methods", hours: "10.5", color: "bg-terracotta/50" },
    { name: "Context Window Mastery", hours: "8", color: "bg-sage/30" },
  ];

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-sm font-medium text-foreground">Learning Activity</h3>
        <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
          This Week
        </span>
      </div>
      <p className="text-lg font-semibold text-foreground mb-4">
        {hrs} <span className="text-xs font-normal text-muted-foreground">hours</span>{" "}
        {mins} <span className="text-xs font-normal text-muted-foreground">minutes</span>
      </p>

      {/* Chart */}
      <div className="flex items-end gap-0">
        {/* Y axis */}
        <div className="flex flex-col-reverse justify-between mr-2" style={{ height: chartHeight }}>
          {yTicks.map((t) => (
            <span key={t} className="text-[10px] text-muted-foreground leading-none">
              {t}h
            </span>
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end justify-between gap-2">
          {data.map((d) => {
            const total = d.segments.reduce((s, seg) => s + seg.value, 0);
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full flex flex-col-reverse gap-0.5 rounded-t-md overflow-hidden"
                  style={{ height: `${(total / (Math.ceil(maxVal) + 1)) * chartHeight}px` }}
                >
                  {d.segments.map((seg, i) => (
                    <div
                      key={i}
                      className={`w-full ${seg.color} rounded-sm`}
                      style={{
                        height: `${(seg.value / total) * 100}%`,
                        minHeight: 4,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course breakdown */}
      <div className="flex gap-3 mt-4 pt-3 border-t border-border/50">
        {courses.map((c) => (
          <div
            key={c.name}
            className="flex-1 rounded-lg border border-border/30 p-2.5"
          >
            <div className={`w-full h-1 rounded-full ${c.color} mb-2`} />
            <p className="text-sm font-semibold text-foreground">{c.hours} <span className="text-[11px] font-normal text-muted-foreground">Hours</span></p>
            <p className="text-[11px] text-muted-foreground truncate">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
