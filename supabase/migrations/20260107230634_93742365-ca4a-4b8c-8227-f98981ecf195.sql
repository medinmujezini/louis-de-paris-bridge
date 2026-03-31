-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles - users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- RLS policy - only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create units table
CREATE TABLE public.units (
    id TEXT PRIMARY KEY, -- Matches UE cube tags, never changes
    name TEXT NOT NULL,
    floor INTEGER NOT NULL,
    surface DECIMAL NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    price DECIMAL NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    orientation TEXT NOT NULL CHECK (orientation IN ('north', 'south', 'east', 'west')),
    features TEXT[] DEFAULT '{}',
    thumbnail TEXT,
    section TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on units
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Everyone can read units (public display)
CREATE POLICY "Anyone can view units"
ON public.units
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can modify units
CREATE POLICY "Admins can insert units"
ON public.units
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update units"
ON public.units
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete units"
ON public.units
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_units_updated_at
BEFORE UPDATE ON public.units
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data from mock units
INSERT INTO public.units (id, name, floor, surface, bedrooms, bathrooms, price, available, orientation, features) VALUES
    ('unit-a1', 'Unit A1', 1, 75, 2, 1, 320000, true, 'south', ARRAY['Balcony', 'City View']),
    ('unit-a2', 'Unit A2', 1, 95, 3, 2, 420000, true, 'east', ARRAY['Corner Unit', 'Garden Access']),
    ('unit-b1', 'Unit B1', 2, 65, 1, 1, 250000, false, 'north', ARRAY['Compact Layout']),
    ('unit-b2', 'Unit B2', 2, 85, 2, 2, 380000, true, 'west', ARRAY['Open Kitchen', 'Balcony']),
    ('unit-c1', 'Unit C1', 3, 120, 4, 2, 580000, true, 'south', ARRAY['Penthouse', 'Terrace', 'Panoramic View']),
    ('unit-c2', 'Unit C2', 3, 110, 3, 2, 520000, false, 'east', ARRAY['Penthouse', 'Terrace']),
    ('unit-d1', 'Unit D1', 4, 55, 1, 1, 220000, true, 'north', ARRAY['Studio Style']),
    ('unit-d2', 'Unit D2', 4, 90, 2, 2, 400000, true, 'west', ARRAY['City View', 'Walk-in Closet']);