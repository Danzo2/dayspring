import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Pen, Megaphone, Brain, Plus, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCourseProgressByCourse, useCourses } from "@/hooks/useDashboardData";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseEditorModal } from "@/components/CourseEditorModal";

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

export function ActiveCourses() {
  const navigate = useNavigate();
  const { data: courses } = useCourses();
  const { data: progressByCourse } = useCourseProgressByCourse();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const hasCourses = courses && courses.length > 0;

  const courseCards = hasCourses
    ? courses.map((c, i) => {
        const IconComp = iconMap[c.icon_name ?? ""] ?? Code2;
        const colors = colorPairs[i % colorPairs.length];
        return {
          id: c.id,
          icon: IconComp,
          ...colors,
          category: c.category ?? "Course",
          title: c.title,
          progress: progressByCourse?.[c.id] ?? 0,
        };
      })
    : [];

  return (
    <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-foreground">Active Courses</h2>
        <Button
          type="button"
          onClick={() => {
            setEditingCourseId(null);
            setEditorOpen(true);
          }}
          className="bg-sage text-primary-foreground hover:bg-sage-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>
      {!hasCourses && (
        <div className="bg-card rounded-xl p-8 shadow-card border border-border/30 text-center">
          <p className="text-sm text-muted-foreground">No active courses yet.</p>
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {courseCards.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/courses/${course.id}`)}
            className="min-w-[260px] max-w-[260px] bg-card rounded-xl p-5 shadow-card border border-border/30 hover:shadow-card-hover hover:-translate-y-1 transition-sanctuary cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg ${course.iconBg} flex items-center justify-center`}>
                <course.icon className={`w-[18px] h-[18px] ${course.iconColor}`} strokeWidth={1.8} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                  {course.category}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCourseId(course.id);
                    setEditorOpen(true);
                  }}
                  className="w-7 h-7 rounded-md bg-muted/50 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-sanctuary flex items-center justify-center"
                  aria-label={`Edit ${course.title}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
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
      <CourseEditorModal
        open={editorOpen}
        courseId={editingCourseId}
        onClose={() => setEditorOpen(false)}
      />
    </section>
  );
}
