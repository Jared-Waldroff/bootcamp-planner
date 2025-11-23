-- 1. Add is_waiting column
ALTER TABLE public.exercises 
ADD COLUMN is_waiting boolean DEFAULT false;

-- 2. Update existing exercises to be "Waiting" based on user list
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%Step back lunges to knee drive%';
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%Tap squats%';
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%Burpees%';
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%Plank shoulder taps%';
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%Hover alt lunges%';
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%High knees and butt kicks%';
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%Squat + knee drive%';
UPDATE public.exercises SET is_waiting = true WHERE name ILIKE '%Jumping jacks%';

-- 3. Update existing exercises to be "Main" (Partner/Main) - Explicitly ensuring they are false (default is false, but good to be sure)
-- (No need to run updates for false since it's default, but we can verify)

-- 4. Clear existing workouts because the structure is changing (Optional, but recommended to avoid UI crashes with old format)
-- DELETE FROM public.workouts; 
-- OR we can keep them and handle the UI gracefully. Let's keep them for now.
