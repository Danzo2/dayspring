import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ArrowLeft, Play, CheckCircle2, Circle, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useCourseWithUnits, useUserProgress } from "@/hooks/useDashboardData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function CoursePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
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

  const trackSectionOpen = useMutation({
    mutationFn: async (section: any) => {
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];

      const upsertAccess = supabase.from("recently_accessed").insert({
        user_id: user.id,
        section_id: section.id,
        accessed_at: new Date().toISOString(),
      });

      const insertSession = supabase.from("learning_sessions").insert({
        user_id: user.id,
        course_id: course?.id ?? null,
        activity_date: today,
        duration_minutes: section.duration_minutes ?? 15,
      });

      const [{ error: accessError }, { error: sessionError }] = await Promise.all([upsertAccess, insertSession]);
      if (accessError) throw accessError;
      if (sessionError) throw sessionError;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recently_accessed", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["learning_sessions_week", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["learning_sessions_range", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["today_study", user?.id] }),
      ]);
    },
  });

  const toggleSectionCompletion = useMutation({
    mutationFn: async (payload: { sectionId: string; courseId?: string | null; completed: boolean; duration: number }) => {
      if (!user) throw new Error("You must be signed in.");
      const now = new Date().toISOString();

      const { data: existingProgress, error: existingProgressError } = await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("section_id", payload.sectionId)
        .maybeSingle();
      if (existingProgressError) throw existingProgressError;

      if (existingProgress?.id) {
        const { error: progressError } = await supabase
          .from("user_progress")
          .update({
            is_completed: payload.completed,
            completed_at: payload.completed ? now : null,
          })
          .eq("id", existingProgress.id);
        if (progressError) throw progressError;
      } else {
        const { error: progressError } = await supabase.from("user_progress").insert({
          user_id: user.id,
          section_id: payload.sectionId,
          is_completed: payload.completed,
          completed_at: payload.completed ? now : null,
        });
        if (progressError) throw progressError;
      }

      const { error: accessError } = await supabase.from("recently_accessed").insert({
        user_id: user.id,
        section_id: payload.sectionId,
        accessed_at: now,
      });
      if (accessError) throw accessError;

      if (payload.completed) {
        const today = new Date().toISOString().split("T")[0];
        const { error: sessionError } = await supabase.from("learning_sessions").insert({
          user_id: user.id,
          course_id: payload.courseId ?? null,
          activity_date: today,
          duration_minutes: payload.duration > 0 ? payload.duration : 15,
        });
        if (sessionError) throw sessionError;
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user_progress", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["course_progress_by_course", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["section_stats", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["course_mastery_stats", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["learning_sessions_week", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["learning_sessions_range", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["today_study", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["recently_accessed", user?.id] }),
      ]);
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't update section progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
                {totalSections} sections
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
                      <div
                        key={section.id}
                        onClick={async () => {
                          if (section.content_url) {
                            window.open(section.content_url, "_blank", "noopener,noreferrer");
                          }
                          await trackSectionOpen.mutateAsync(section);
                        }}
                        onKeyDown={async (e) => {
                          if (e.key !== "Enter" && e.key !== " ") return;
                          e.preventDefault();
                          if (section.content_url) {
                            window.open(section.content_url, "_blank", "noopener,noreferrer");
                          }
                          await trackSectionOpen.mutateAsync(section);
                        }}
                        role="button"
                        tabIndex={0}
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
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionCompletion.mutate({
                              sectionId: section.id,
                              courseId: course?.id ?? null,
                              completed: !completed,
                              duration: section.duration_minutes ?? 15,
                            });
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded-md border transition-sanctuary ${
                            completed
                              ? "border-sage/40 text-sage-hover bg-sage-light/40"
                              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {completed ? "Completed" : "Mark Complete"}
                        </button>
                        <Play className="w-4 h-4 text-muted-foreground/40 group-hover:text-sage transition-sanctuary" strokeWidth={1.8} />
                      </div>
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
