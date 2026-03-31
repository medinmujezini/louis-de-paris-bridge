
-- Create poi_cache table for caching OpenStreetMap POIs
CREATE TABLE public.poi_cache (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT,
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.poi_cache ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read POIs"
ON public.poi_cache
FOR SELECT
USING (true);

-- Service role can insert/update (edge function uses service role key)
CREATE POLICY "Service role can insert POIs"
ON public.poi_cache
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update POIs"
ON public.poi_cache
FOR UPDATE
USING (true);

CREATE POLICY "Service role can delete POIs"
ON public.poi_cache
FOR DELETE
USING (true);
