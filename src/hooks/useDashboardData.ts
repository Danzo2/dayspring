import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useCourseMasteryStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["course_mastery_stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_mastery_stats")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCourseProgressByCourse() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["course_progress_by_course", user?.id],
    queryFn: async () => {
      const [{ data: units, error: unitsError }, { data: sections, error: sectionsError }, { data: progress, error: progressError }] =
        await Promise.all([
          supabase.from("units").select("id, course_id"),
          supabase.from("sections").select("id, unit_id"),
          supabase.from("user_progress").select("section_id, is_completed").eq("user_id", user!.id),
        ]);

      if (unitsError) throw unitsError;
      if (sectionsError) throw sectionsError;
      if (progressError) throw progressError;

      const unitToCourse = new Map<string, string>();
      units.forEach((unit) => {
        if (unit.course_id) {
          unitToCourse.set(unit.id, unit.course_id);
        }
      });

      const sectionToCourse = new Map<string, string>();
      const totalsByCourse: Record<string, { total: number; completed: number }> = {};

      sections.forEach((section) => {
        if (!section.unit_id) return;
        const courseId = unitToCourse.get(section.unit_id);
        if (!courseId) return;

        sectionToCourse.set(section.id, courseId);
        if (!totalsByCourse[courseId]) {
          totalsByCourse[courseId] = { total: 0, completed: 0 };
        }
        totalsByCourse[courseId].total += 1;
      });

      progress.forEach((entry) => {
        if (!entry.is_completed || !entry.section_id) return;
        const courseId = sectionToCourse.get(entry.section_id);
        if (!courseId || !totalsByCourse[courseId]) return;
        totalsByCourse[courseId].completed += 1;
      });

      const progressByCourse: Record<string, number> = {};
      Object.entries(totalsByCourse).forEach(([courseId, stats]) => {
        progressByCourse[courseId] =
          stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      });

      return progressByCourse;
    },
    enabled: !!user,
  });
}

export function useLearningSessionsThisWeek() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["learning_sessions_week", user?.id],
    queryFn: async () => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("learning_sessions")
        .select("*, courses(title)")
        .eq("user_id", user!.id)
        .gte("activity_date", startOfWeek.toISOString().split("T")[0]);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useLearningSessionsRange(days: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["learning_sessions_range", user?.id, days],
    queryFn: async () => {
      const start = new Date();
      start.setDate(start.getDate() - days);

      const { data, error } = await supabase
        .from("learning_sessions")
        .select("activity_date, duration_minutes")
        .eq("user_id", user!.id)
        .gte("activity_date", start.toISOString().split("T")[0]);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUserSkills() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_skills", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_skills")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useRecentlyAccessed() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["recently_accessed", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recently_accessed")
        .select("*, sections(title, content_type, units(title, courses(title)))")
        .eq("user_id", user!.id)
        .order("accessed_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useGoals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useMilestones() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["milestones", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("user_id", user!.id)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCourseWithUnits(courseId?: string) {
  return useQuery({
    queryKey: ["course_units", courseId],
    queryFn: async () => {
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId!)
        .maybeSingle();
      if (courseError) throw courseError;

      if (!course) {
        return { course: null, units: [] };
      }

      const { data: units, error: unitsError } = await supabase
        .from("units")
        .select("*, sections(*)")
        .eq("course_id", courseId!)
        .order("order_index");
      if (unitsError) throw unitsError;

      return { course, units };
    },
    enabled: !!courseId,
  });
}

export function useUserProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("section_id, is_completed")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Map(data.map((p) => [p.section_id, p.is_completed]));
    },
    enabled: !!user,
  });
}

export function useTodayStudyMinutes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["today_study", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("learning_sessions")
        .select("duration_minutes")
        .eq("user_id", user!.id)
        .eq("activity_date", today);
      if (error) throw error;
      return data.reduce((sum, s) => sum + s.duration_minutes, 0);
    },
    enabled: !!user,
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
