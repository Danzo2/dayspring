import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useCourseProgressByCourse, useCourses, useUserSkills } from "@/hooks/useDashboardData";

export function SkillGraph() {
  const { data: skills } = useUserSkills();
  const { data: courses } = useCourses();
  const { data: progressByCourse } = useCourseProgressByCourse();
  const hasSkills = !!skills && skills.length > 0;
  const hasCourses = !!courses && courses.length > 0;

  const chartData =
    hasSkills
      ? skills.map((s) => ({
          subject: s.skill_name,
          score: s.score ?? 0,
          fullMark: 100,
        }))
      : hasCourses
        ? courses.slice(0, 6).map((course) => ({
            subject: course.title,
            score: progressByCourse?.[course.id] ?? 0,
            fullMark: 100,
          }))
        : [];

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/30">
      <h3 className="text-sm font-medium text-foreground mb-1">Skill Graph</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="hsl(var(--border))" strokeWidth={0.8} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Skills"
              dataKey="score"
              stroke="hsl(var(--sage))"
              fill="hsl(var(--sage))"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "hsl(var(--terracotta))",
                stroke: "hsl(var(--terracotta))",
                strokeWidth: 0,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">No skill data yet.</p>
        </div>
      )}
    </div>
  );
}
