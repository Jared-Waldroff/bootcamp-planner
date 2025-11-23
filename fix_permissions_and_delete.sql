-- 1. Enable DELETE permission for everyone (public) on the 'workouts' table
-- This is required because Row Level Security (RLS) is enabled but no delete policy exists.
CREATE POLICY "Enable delete for all users" 
ON "public"."workouts" 
FOR DELETE 
TO public 
USING (true);

-- 2. Delete the specific legacy workouts you requested
DELETE FROM workouts WHERE date IN ('2024-11-19', '2024-11-12', '2024-10-29');
