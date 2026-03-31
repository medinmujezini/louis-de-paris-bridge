ALTER TABLE public.units ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

INSERT INTO public.units (id, name, floor, surface, bedrooms, bathrooms, price, available, orientation, features, unit_type, is_demo)
VALUES
  ('v-01', 'Villa 01', 0, 320, 5, 4, 0, true, 'south', ARRAY['Garden', 'Pool'], 'villa', true),
  ('v-02', 'Villa 02', 0, 280, 4, 3, 0, true, 'east', ARRAY['Garden'], 'villa', false),
  ('v-03', 'Villa 03', 0, 350, 5, 4, 0, false, 'west', ARRAY['Garden', 'Pool'], 'villa', false),
  ('v-04', 'Villa 04', 0, 290, 4, 3, 0, true, 'north', ARRAY['Garden'], 'villa', false)
ON CONFLICT (id) DO NOTHING;

UPDATE public.units SET is_demo = true WHERE id = 'b1-a9';
