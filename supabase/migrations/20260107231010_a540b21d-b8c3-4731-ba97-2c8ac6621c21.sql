-- Run this after signing up to grant yourself admin access
-- Replace 'your-email@example.com' with your actual email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'your-email@example.com'
ON CONFLICT DO NOTHING;