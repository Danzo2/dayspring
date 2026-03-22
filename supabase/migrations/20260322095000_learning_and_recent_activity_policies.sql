-- Ensure activity tracking tables support authenticated user writes

ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_accessed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own sessions" ON public.learning_sessions;
CREATE POLICY "Users can read own sessions"
  ON public.learning_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.learning_sessions;
CREATE POLICY "Users can insert own sessions"
  ON public.learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON public.learning_sessions;
CREATE POLICY "Users can update own sessions"
  ON public.learning_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own sessions" ON public.learning_sessions;
CREATE POLICY "Users can delete own sessions"
  ON public.learning_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own recently accessed" ON public.recently_accessed;
CREATE POLICY "Users can read own recently accessed"
  ON public.recently_accessed
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own recently accessed" ON public.recently_accessed;
CREATE POLICY "Users can insert own recently accessed"
  ON public.recently_accessed
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recently accessed" ON public.recently_accessed;
CREATE POLICY "Users can update own recently accessed"
  ON public.recently_accessed
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own recently accessed" ON public.recently_accessed;
CREATE POLICY "Users can delete own recently accessed"
  ON public.recently_accessed
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own skills" ON public.user_skills;
CREATE POLICY "Users can read own skills"
  ON public.user_skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own skills" ON public.user_skills;
CREATE POLICY "Users can insert own skills"
  ON public.user_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own skills" ON public.user_skills;
CREATE POLICY "Users can update own skills"
  ON public.user_skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own skills" ON public.user_skills;
CREATE POLICY "Users can delete own skills"
  ON public.user_skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
