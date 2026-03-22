-- Enable authenticated CRUD for course authoring from dashboard UI

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read courses" ON public.courses;
CREATE POLICY "Anyone can read courses"
  ON public.courses
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can create courses" ON public.courses;
CREATE POLICY "Authenticated can create courses"
  ON public.courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update courses" ON public.courses;
CREATE POLICY "Authenticated can update courses"
  ON public.courses
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete courses" ON public.courses;
CREATE POLICY "Authenticated can delete courses"
  ON public.courses
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read units" ON public.units;
CREATE POLICY "Anyone can read units"
  ON public.units
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can create units" ON public.units;
CREATE POLICY "Authenticated can create units"
  ON public.units
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update units" ON public.units;
CREATE POLICY "Authenticated can update units"
  ON public.units
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete units" ON public.units;
CREATE POLICY "Authenticated can delete units"
  ON public.units
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read sections" ON public.sections;
CREATE POLICY "Anyone can read sections"
  ON public.sections
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can create sections" ON public.sections;
CREATE POLICY "Authenticated can create sections"
  ON public.sections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update sections" ON public.sections;
CREATE POLICY "Authenticated can update sections"
  ON public.sections
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete sections" ON public.sections;
CREATE POLICY "Authenticated can delete sections"
  ON public.sections
  FOR DELETE
  TO authenticated
  USING (true);
