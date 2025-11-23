-- 1. Insert Exercises into the Bank
-- We use ON CONFLICT DO NOTHING to avoid duplicates if you run this multiple times (requires unique name constraint, but we'll just insert for now)

INSERT INTO public.exercises (name, category, partner_exercise, description) VALUES
-- Run Club / General
('Step back lunges to knee drive', 'Lower Body', false, 'Step back into a lunge, then drive the knee up explosively.'),
('Partner same leg lunges', 'Lower Body', true, 'Face partner, perform lunges on the same leg simultaneously.'),
('Tap squats', 'Lower Body', false, 'Squat down, tap the floor, explode up.'),
('Partner Squat & High Knees', 'Lower Body', true, 'One partner holds a squat with arms out. Other partner does high knees hitting their hands.'),
('Burpees', 'Full Body', false, 'Chest to floor, jump up.'),
('Hollow hold rolls', 'Core', true, 'Total eclipse of the heart techno style.'),

-- Oct 29 (Spooky Run)
('Push ups', 'Upper Body', false, 'Standard push up.'),
('Plank shoulder taps', 'Core', false, 'High plank position, tap opposite shoulder.'),
('Side plank reach throughs', 'Core', true, 'Side plank, reach arm under and through.'),
('Hover alt lunges', 'Lower Body', false, 'Stay low on one leg, move from forward to reverse lunge without rising.'),
('Leap frog', 'Plyo', true, 'Line up, partner up, leap frog over partner.'),

-- Nov 12
('Partner push-up/plank high five', 'Upper Body', true, 'Alternate push-up or plank with a high five to partner.'),
('Partner alt v-sit', 'Core', true, 'V-sit position, alternating movements with partner.'),
('Jumping jacks', 'Cardio', false, 'Standard jumping jacks.'),
('Squat hold into burpee on JUMP', 'Full Body', true, 'Hold squat, perform burpee when partner jumps/signals.'),

-- Nov 19
('High knees and butt kicks', 'Cardio', false, 'Alternate high knees and butt kicks.'),
('Partner pushup and v-sit over/under', 'Full Body', true, 'One does pushup, other v-sit. Feet go over and under.'),
('Squat + knee drive', 'Lower Body', false, 'Squat followed by a knee drive.'),
('Partner lunges', 'Lower Body', true, 'Lunges with a partner.'),
('Thunderstruck Plank/Burpee Challenge', 'Core', true, 'Plank hold, do a burpee every time "Thunder" is sung.');


-- 2. Insert Historical Workouts
-- Note: We construct the JSONB manually. We generate random UUIDs for the exercise instances in the workout log.

INSERT INTO public.workouts (date, exercises) VALUES
-- October 29th
('2025-10-29', '[
  {"id": "a1b2c3d4-0001-4000-a000-000000000001", "name": "Burpees", "category": "Full Body", "partnerExercise": false, "description": "Chest to floor, jump up."},
  {"id": "a1b2c3d4-0001-4000-a000-000000000002", "name": "Push ups", "category": "Upper Body", "partnerExercise": false, "description": "Standard push up."},
  {"id": "a1b2c3d4-0001-4000-a000-000000000003", "name": "Plank shoulder taps", "category": "Core", "partnerExercise": false, "description": "High plank position, tap opposite shoulder."},
  {"id": "a1b2c3d4-0001-4000-a000-000000000004", "name": "Side plank reach throughs", "category": "Core", "partnerExercise": true, "description": "Side plank, reach arm under and through."},
  {"id": "a1b2c3d4-0001-4000-a000-000000000005", "name": "Hover alt lunges", "category": "Lower Body", "partnerExercise": false, "description": "Stay low on one leg..."},
  {"id": "a1b2c3d4-0001-4000-a000-000000000006", "name": "Leap frog", "category": "Plyo", "partnerExercise": true, "description": "Line up, partner up, leap frog."}
]'::jsonb),

-- November 12
('2025-11-12', '[
  {"id": "a1b2c3d4-0002-4000-a000-000000000001", "name": "Step back lunges to knee drive", "category": "Lower Body", "partnerExercise": false, "description": "Step back into a lunge..."},
  {"id": "a1b2c3d4-0002-4000-a000-000000000002", "name": "Partner push-up/plank high five", "category": "Upper Body", "partnerExercise": true, "description": "Alternate push-up or plank..."},
  {"id": "a1b2c3d4-0002-4000-a000-000000000003", "name": "Tap squats", "category": "Lower Body", "partnerExercise": false, "description": "Squat down, tap the floor."},
  {"id": "a1b2c3d4-0002-4000-a000-000000000004", "name": "Partner alt v-sit", "category": "Core", "partnerExercise": true, "description": "V-sit position..."},
  {"id": "a1b2c3d4-0002-4000-a000-000000000005", "name": "Jumping jacks", "category": "Cardio", "partnerExercise": false, "description": "Standard jumping jacks."},
  {"id": "a1b2c3d4-0002-4000-a000-000000000006", "name": "Squat hold into burpee on JUMP", "category": "Full Body", "partnerExercise": true, "description": "Hold squat..."}
]'::jsonb),

-- November 19
('2025-11-19', '[
  {"id": "a1b2c3d4-0003-4000-a000-000000000001", "name": "High knees and butt kicks", "category": "Cardio", "partnerExercise": false, "description": "Alternate high knees..."},
  {"id": "a1b2c3d4-0003-4000-a000-000000000002", "name": "Partner pushup and v-sit over/under", "category": "Full Body", "partnerExercise": true, "description": "One does pushup, other v-sit..."},
  {"id": "a1b2c3d4-0003-4000-a000-000000000003", "name": "Squat + knee drive", "category": "Lower Body", "partnerExercise": false, "description": "Squat followed by a knee drive."},
  {"id": "a1b2c3d4-0003-4000-a000-000000000004", "name": "Partner lunges", "category": "Lower Body", "partnerExercise": true, "description": "Lunges with a partner."},
  {"id": "a1b2c3d4-0003-4000-a000-000000000005", "name": "Jumping jacks", "category": "Cardio", "partnerExercise": false, "description": "Standard jumping jacks."},
  {"id": "a1b2c3d4-0003-4000-a000-000000000006", "name": "Thunderstruck Plank/Burpee Challenge", "category": "Core", "partnerExercise": true, "description": "Song challenge..."}
]'::jsonb);
