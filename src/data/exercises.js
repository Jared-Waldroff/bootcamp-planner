export const EXERCISE_CATEGORIES = [
    "Upper Body",
    "Lower Body",
    "Core",
    "Upper Body & Lower Body",
    "Upper Body & Core",
    "Lower Body & Core",
    "Full Body",
    "Cardio",
    "Plyo",
    "Song Challenge"
];

export const EXERCISES = [
    // Upper Body
    {
        id: "ub-1",
        name: "Push Ups",
        category: "Upper Body",
        partnerExercise: false,
        description: "Start in a plank position. Lower your body until your chest nearly touches the floor. Push back up."
    },
    {
        id: "ub-2",
        name: "Tricep Dips (Chair/Floor)",
        category: "Upper Body",
        partnerExercise: false,
        description: "Hands behind you on a chair or floor. Lower hips by bending elbows, then push back up."
    },
    {
        id: "ub-3",
        name: "Pike Push Ups",
        category: "Upper Body",
        partnerExercise: false,
        description: "Downward dog position. Lower head towards floor by bending elbows, then push back up. Targets shoulders."
    },
    {
        id: "ub-4",
        name: "Arm Circles",
        category: "Upper Body",
        partnerExercise: false,
        description: "Extend arms to sides. Make small circles forward for 20s, then backward. Keep arms engaged."
    },
    {
        id: "ub-5",
        name: "Plank Shoulder Taps",
        category: "Upper Body",
        partnerExercise: false,
        description: "High plank position. Tap right hand to left shoulder, then left hand to right shoulder. Keep hips stable."
    },
    {
        id: "ub-6",
        name: "Partner High Fives (Plank)",
        category: "Upper Body",
        partnerExercise: true,
        description: "Face partner in plank. Lift opposite hands to high five. Alternate hands."
    },

    // Lower Body
    {
        id: "lb-1",
        name: "Squats",
        category: "Lower Body",
        partnerExercise: false,
        description: "Feet shoulder-width apart. Lower hips back and down as if sitting in a chair. Keep chest up."
    },
    {
        id: "lb-2",
        name: "Lunges",
        category: "Lower Body",
        partnerExercise: false,
        description: "Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Alternate legs."
    },
    {
        id: "lb-3",
        name: "Glute Bridges",
        category: "Lower Body",
        partnerExercise: false,
        description: "Lie on back, knees bent. Lift hips towards ceiling, squeezing glutes at the top."
    },
    {
        id: "lb-4",
        name: "Calf Raises",
        category: "Lower Body",
        partnerExercise: false,
        description: "Stand tall. Raise heels off the ground, standing on toes. Lower back down slowly."
    },
    {
        id: "lb-5",
        name: "Wall Sit",
        category: "Lower Body",
        partnerExercise: false,
        description: "Lean back against a wall. Slide down until knees are at 90 degrees. Hold."
    },
    {
        id: "lb-6",
        name: "Partner Squats (Back to Back)",
        category: "Lower Body",
        partnerExercise: true,
        description: "Stand back-to-back with partner. Link arms or lean against each other. Squat down and up together."
    },

    // Core
    {
        id: "c-1",
        name: "Plank",
        category: "Core",
        partnerExercise: false,
        description: "Forearms on ground, body in straight line from head to heels. Hold, engaging core."
    },
    {
        id: "c-2",
        name: "Crunches",
        category: "Core",
        partnerExercise: false,
        description: "Lie on back, knees bent. Lift shoulders off ground using abs. Lower back down."
    },
    {
        id: "c-3",
        name: "Bicycle Crunches",
        category: "Core",
        partnerExercise: false,
        description: "Lie on back. Bring opposite elbow to opposite knee while extending other leg. Alternate rapidly."
    },
    {
        id: "c-4",
        name: "Leg Raises",
        category: "Core",
        partnerExercise: false,
        description: "Lie on back. Lift legs straight up to 90 degrees. Lower slowly without touching floor."
    },
    {
        id: "c-5",
        name: "Russian Twists",
        category: "Core",
        partnerExercise: false,
        description: "Sit with torso leaned back, feet off ground. Twist torso side to side, touching floor."
    },
    {
        id: "c-6",
        name: "Partner Leg Throws",
        category: "Core",
        partnerExercise: true,
        description: "One person lies down holding partner's ankles. Partner throws legs down/side. Don't let feet touch floor."
    },

    // Upper Body & Lower Body
    {
        id: "ul-1",
        name: "Burpees",
        category: "Upper Body & Lower Body",
        partnerExercise: false,
        description: "Squat, kick feet back to plank, push up, jump feet forward, jump up."
    },
    {
        id: "ul-2",
        name: "Jumping Jacks",
        category: "Upper Body & Lower Body",
        partnerExercise: false,
        description: "Jump feet apart while raising arms. Jump feet together while lowering arms."
    },
    {
        id: "ul-3",
        name: "Mountain Climbers",
        category: "Upper Body & Lower Body",
        partnerExercise: false,
        description: "High plank position. Drive knees towards chest alternately and rapidly."
    },
    {
        id: "ul-4",
        name: "Bear Crawls",
        category: "Upper Body & Lower Body",
        partnerExercise: false,
        description: "Crawl on hands and feet (knees off ground). Keep back flat."
    },
    {
        id: "ul-5",
        name: "Inchworms",
        category: "Upper Body & Lower Body",
        partnerExercise: false,
        description: "Stand tall. Walk hands out to plank. Walk feet to hands. Repeat."
    },

    // Upper Body & Core
    {
        id: "uc-1",
        name: "Commandos (Plank Up-Downs)",
        category: "Upper Body & Core",
        partnerExercise: false,
        description: "Start in forearm plank. Push up to high plank one hand at a time. Lower back to forearms."
    },
    {
        id: "uc-2",
        name: "Side Plank with Reach",
        category: "Upper Body & Core",
        partnerExercise: false,
        description: "Side plank position. Reach top arm under body, then extend up to ceiling."
    },
    {
        id: "uc-3",
        name: "Renegade Rows (Bodyweight)",
        category: "Upper Body & Core",
        partnerExercise: false,
        description: "High plank. Pull one hand to hip (simulating row) while keeping hips square. Alternate."
    },

    // Lower Body & Core
    {
        id: "lc-1",
        name: "Squat Jumps",
        category: "Lower Body & Core",
        partnerExercise: false,
        description: "Perform a squat, then explode upwards into a jump. Land softly."
    },
    {
        id: "lc-2",
        name: "Lunge with Twist",
        category: "Lower Body & Core",
        partnerExercise: false,
        description: "Lunge forward. Twist torso towards the front leg. Return to center and step back."
    },
    {
        id: "lc-3",
        name: "High Knees",
        category: "Lower Body & Core",
        partnerExercise: false,
        description: "Run in place, driving knees up towards chest as high as possible."
    },

    // Song Challenge
    {
        id: "sc-1",
        name: "Bring Sally Up (Squats)",
        category: "Song Challenge",
        partnerExercise: false,
        description: "Song: 'Flower' by Moby. Squat down on 'Bring Sally Down', hold. Stand up on 'Bring Sally Up'."
    },
    {
        id: "sc-2",
        name: "Roxanne (Burpees)",
        category: "Song Challenge",
        partnerExercise: false,
        description: "Song: 'Roxanne' by The Police. Do a burpee every time you hear 'Roxanne'. Plank/Jog in between."
    },
    {
        id: "sc-3",
        name: "Flower (Moby) - Push Ups",
        category: "Song Challenge",
        partnerExercise: false,
        description: "Same as squats, but with Push Ups. Down on 'Bring Sally Down', Up on 'Bring Sally Up'."
    },
];
