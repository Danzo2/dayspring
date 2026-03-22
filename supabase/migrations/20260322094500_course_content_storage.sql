-- Storage bucket for course files uploaded from course editor

INSERT INTO storage.buckets (id, name, public)
VALUES ('course-content', 'course-content', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read course content" ON storage.objects;
CREATE POLICY "Public can read course content"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'course-content');

DROP POLICY IF EXISTS "Authenticated can upload course content" ON storage.objects;
CREATE POLICY "Authenticated can upload course content"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'course-content'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Authenticated can update own course content" ON storage.objects;
CREATE POLICY "Authenticated can update own course content"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'course-content'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Authenticated can delete own course content" ON storage.objects;
CREATE POLICY "Authenticated can delete own course content"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'course-content'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
