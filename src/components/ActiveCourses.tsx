import { Code2, Pen, Megaphone, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCourseMasteryStats, useCourses } from "@/hooks/useDashboardData";
import { type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Pen,
  Megaphone,
  Brain,
};

const colorPairs = [
  { iconColor: "text-sage", iconBg: "bg-sage-light" },
  { iconColor: "text-terracotta", iconBg: "bg-terracotta-light" },
];

// Fallback hardcoded courses for when DB is empty
const fallbackCourses = [
  { icon: Code2, iconColor: "text-sage", iconBg: "bg-sage-light", category: "AI Strategy", title: "Advanced Prompt Engineering", progress: 75 },
  { icon: Pen, iconColor: "text-terracotta", iconBg: "bg-terracotta-light", category: "Design", title: "UX Research Methods", progress: 42 },
  { icon: Megaphone, iconColor: "text-sage", iconBg: "bg-sage-light", category: "Development", title: "Context Window Mastery", progress: 88 },
  { icon: Brain, iconColor: "text-terracotta", iconBg: "bg-terracotta-light", category: "Research", title: "Evaluation Frameworks", progress: 31 },
];

export function ActiveCourses() {
  const { data: courses } = useCourses();
  const { data: mastery } = useCourseMasteryStats();

  const hasCourses = courses && courses.length > 0;

  const courseCards = hasCourses
    ? courses.map((c, i) => {
        const stats = mastery?.find((m) => m.course_id === c.id);
        const IconComp = iconMap[c.icon_name ?? ""] ?? Code2;
        const colors = colorPairs[i % colorPairs.length];
        return {
          icon: IconComp,
          ...colors,
          category: c.category ?? "Course",
          title: c.title,
          progress: stats?.completion_percentage ?? 0,
        };
      })
    : fallbackCourses;

  return (
    <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
      <h2 className="text-base font-medium text-foreground mb-4">Active Courses</h2>
      <div className="grid grid-cols-4 gap-4">
        {courseCards.map((course) => (
          <div
            key={course.title}
            className="bg-card rounded-xl p-5 shadow-card border border-border/30 hover:shadow-card-hover hover:-translate-y-1 transition-sanctuary cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg ${course.iconBg} flex items-center justify-center`}>
                <course.icon className={`w-[18px] h-[18px] ${course.iconColor}`} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                {course.category}
              </span>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-4 leading-snug">
              {course.title}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Progress value={Number(course.progress)} className="h-1.5 bg-muted" />
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {Number(course.progress)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
