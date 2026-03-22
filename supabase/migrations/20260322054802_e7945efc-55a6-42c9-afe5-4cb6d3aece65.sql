-- Fix: Enable RLS on tables missing it
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for courses (public read, no anon write)
CREATE POLICY "Anyone can read courses" ON public.courses FOR SELECT USING (true);

-- RLS policies for units (public read)
CREATE POLICY "Anyone can read units" ON public.units FOR SELECT USING (true);

-- RLS policies for sections (public read)
CREATE POLICY "Anyone can read sections" ON public.sections FOR SELECT USING (true);

-- RLS policies for user_progress (user-scoped)
CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.user_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix: Recreate course_mastery_stats view WITHOUT referencing auth.users
-- and WITH security_invoker to fix both auth_users_exposed and security_definer_view
DROP VIEW IF EXISTS public.course_mastery_stats;

CREATE VIEW public.course_mastery_stats
WITH (security_invoker = on) AS
SELECT
  up2.user_id,
  c.id AS course_id,
  c.title AS course_title,
  SUM(s.duration_minutes) FILTER (WHERE (up2.is_completed IS NULL OR up2.is_completed = false)) AS remaining_minutes,
  COUNT(s.id) FILTER (WHERE (up2.is_completed IS NULL OR up2.is_completed = false)) AS remaining_sections,
  ROUND(
    (COUNT(s.id) FILTER (WHERE up2.is_completed = true)::numeric / NULLIF(COUNT(s.id), 0)::numeric) * 100, 0
  ) AS completion_percentage
FROM courses c
JOIN units un ON un.course_id = c.id
JOIN sections s ON s.unit_id = un.id
LEFT JOIN user_progress up2 ON up2.section_id = s.id
GROUP BY up2.user_id, c.id, c.title;