
-- Drop overly permissive write policies (service role bypasses RLS anyway)
DROP POLICY "Service role can insert POIs" ON public.poi_cache;
DROP POLICY "Service role can update POIs" ON public.poi_cache;
DROP POLICY "Service role can delete POIs" ON public.poi_cache;

-- No write policies needed - the edge function uses service role key which bypasses RLS
-- This means anon users cannot write, only read
