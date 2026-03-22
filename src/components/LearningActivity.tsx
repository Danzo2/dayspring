import { useMemo } from "react";
import { useLearningSessionsThisWeek } from "@/hooks/useDashboardData";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const courseColors = [
  "bg-sage/60",
  "bg-terracotta/50",
  "bg-sage/30",
  "bg-terracotta/30",
];

export function LearningActivity() {
  const { data: sessions } = useLearningSessionsThisWeek();

  const { barData, courseBreakdown, totalHrs, totalMins } = useMemo(() => {
    // Group sessions by day of week and course
    const courseMap = new Map<string, { name: string; minutes: number }>();
    const dayMap = new Map<number, Map<string, number>>(); // dayOfWeek -> courseTitle -> minutes

    sessions?.forEach((s) => {
      const courseName = (s as any).courses?.title ?? "Other";
      const courseId = (s as any).course_id ?? "other";
      const date = new Date(s.activity_date + "T00:00:00");
      const dow = (date.getDay() + 6) % 7; // Mon=0

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, { name: courseName, minutes: 0 });
      }
      courseMap.get(courseId)!.minutes += s.duration_minutes;

      if (!dayMap.has(dow)) dayMap.set(dow, new Map());
      const dayEntry = dayMap.get(dow)!;
      dayEntry.set(courseId, (dayEntry.get(courseId) ?? 0) + s.duration_minutes);
    });

    const courseIds = Array.from(courseMap.keys());

    const barData = dayLabels.map((day, i) => {
      const dayEntry = dayMap.get(i);
      return {
        day,
        segments: courseIds.map((cid, ci) => ({
          value: ((dayEntry?.get(cid) ?? 0) / 60),
          color: courseColors[ci % courseColors.length],
        })),
      };
    });

    const courseBreakdown = courseIds.map((cid, ci) => ({
      name: courseMap.get(cid)!.name,
      hours: (courseMap.get(cid)!.minutes / 60).toFixed(1),
      color: courseColors[ci % courseColors.length],
    }));

    const totalMinutes = sessions?.reduce((s, r) => s + r.duration_minutes, 0) ?? 0;

    return {
      barData,
      courseBreakdown,
      totalHrs: Math.floor(totalMinutes / 60),
      totalMins: totalMinutes % 60,
    };
  }, [sessions]);

  const maxVal = Math.max(
    1,
    ...barData.map((d) => d.segments.reduce((s, seg) => s + seg.value, 0))
  );
  const yTicks = [0, 2, 4, 6, 8].filter((t) => t <= Math.ceil(maxVal) + 1);
  const chartHeight = 160;

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-sm font-medium text-foreground">Learning Activity</h3>
        <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
          This Week
        </span>
      </div>
      <p className="text-lg font-semibold text-foreground mb-4">
        {totalHrs} <span className="text-xs font-normal text-muted-foreground">hours</span>{" "}
        {totalMins} <span className="text-xs font-normal text-muted-foreground">minutes</span>
      </p>

      {/* Chart */}
      <div className="flex items-end gap-0">
        <div className="flex flex-col-reverse justify-between mr-2" style={{ height: chartHeight }}>
          {yTicks.map((t) => (
            <span key={t} className="text-[10px] text-muted-foreground leading-none">
              {t}h
            </span>
          ))}
        </div>
        <div className="flex-1 flex items-end justify-between gap-2">
          {barData.map((d) => {
            const total = d.segments.reduce((s, seg) => s + seg.value, 0);
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full flex flex-col-reverse gap-0.5 rounded-t-md overflow-hidden"
                  style={{ height: total > 0 ? `${(total / (Math.ceil(maxVal) + 1)) * chartHeight}px` : "4px" }}
                >
                  {d.segments.map((seg, i) => (
                    <div
                      key={i}
                      className={`w-full ${seg.color} rounded-sm`}
                      style={{
                        height: total > 0 ? `${(seg.value / total) * 100}%` : "100%",
                        minHeight: seg.value > 0 ? 4 : 0,
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
      {courseBreakdown.length > 0 && (
        <div className="flex gap-3 mt-4 pt-3 border-t border-border/50">
          {courseBreakdown.slice(0, 3).map((c) => (
            <div key={c.name} className="flex-1 rounded-lg border border-border/30 p-2.5">
              <div className={`w-full h-1 rounded-full ${c.color} mb-2`} />
              <p className="text-sm font-semibold text-foreground">
                {c.hours} <span className="text-[11px] font-normal text-muted-foreground">Hours</span>
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{c.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
