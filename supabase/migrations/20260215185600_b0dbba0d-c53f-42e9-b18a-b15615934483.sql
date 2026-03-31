
-- Add new columns to units table
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS building text;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS unit_type text NOT NULL DEFAULT 'apartment';
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS terrace numeric;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS duplex_total numeric;
