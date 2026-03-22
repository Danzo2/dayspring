import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ArrowLeft, Play, CheckCircle2, Circle, Clock, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useCourseWithUnits, useUserProgress } from "@/hooks/useDashboardData";

export default function CoursePage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: courseData, isLoading } = useCourseWithUnits(courseId);
  const { data: progressMap } = useUserProgress();

  const course = courseData?.course;
  const units = courseData?.units ?? [];

  const totalSections = units.reduce((s, u) => s + ((u as any).sections?.length ?? 0), 0);
  const completedSections = units.reduce(
    (s, u) =>
      s + ((u as any).sections?.filter((sec: any) => progressMap?.get(sec.id)).length ?? 0),
    0
  );

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-sanctuary mb-6 active:scale-[0.97]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <div className="animate-fade-up">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                {course?.category ?? "Course"}
              </span>
              <h1 className="text-2xl font-medium text-foreground mt-2">
                {course?.title ?? (isLoading ? "Fetching course..." : "Course not found")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {course?.description ?? ""}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" strokeWidth={1.8} />
                {totalSections} lessons
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <Progress value={totalSections > 0 ? (completedSections / totalSections) * 100 : 0} className="h-2 bg-muted" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {completedSections}/{totalSections} complete
            </span>
          </div>
        </div>

        <div className="space-y-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
          {units.map((unit) => (
            <div key={unit.id} className="bg-card rounded-xl shadow-card border border-border/30 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/30">
                <h3 className="text-sm font-medium text-foreground">{unit.title}</h3>
              </div>
              <div className="divide-y divide-border/30">
                {((unit as any).sections ?? [])
                  .sort((a: any, b: any) => a.order_index - b.order_index)
                  .map((section: any) => {
                    const completed = progressMap?.get(section.id) ?? false;
                    return (
                      <button
                        key={section.id}
                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-sanctuary text-left active:scale-[0.99] group"
                      >
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" strokeWidth={1.8} />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 group-hover:text-sage transition-sanctuary" strokeWidth={1.8} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${completed ? "text-muted-foreground" : "text-foreground"}`}>
                            {section.section_number ? `${section.section_number}. ` : ""}{section.title}
                          </p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{section.duration_minutes} min</span>
                        <Play className="w-4 h-4 text-muted-foreground/40 group-hover:text-sage transition-sanctuary" strokeWidth={1.8} />
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
          {units.length === 0 && (
            <div className="bg-card rounded-xl p-8 shadow-card border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">No units found for this course.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
