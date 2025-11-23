import { supabase } from '../lib/supabase';

export const db = {
    // --- Exercises ---
    getAllExercises: async () => {
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .order('name');

        if (error) throw error;

        return data.map(ex => ({
            ...ex,
            partnerExercise: ex.partner_exercise,
            isWaiting: ex.is_waiting
        }));
    },


    saveExercise: async (exercise) => {
        // Prepare data (snake_case for DB)
        const dbExercise = {
            name: exercise.name,
            category: exercise.category,
            partner_exercise: exercise.partnerExercise,
            description: exercise.description,
            is_waiting: exercise.isWaiting
        };

        if (exercise.id) {
            // Update
            const { data, error } = await supabase
                .from('exercises')
                .update(dbExercise)
                .eq('id', exercise.id)
                .select()
                .single();

            if (error) throw error;
            return { ...data, partnerExercise: data.partner_exercise, isWaiting: data.is_waiting };
        } else {
            // Insert
            const { data, error } = await supabase
                .from('exercises')
                .insert(dbExercise)
                .select()
                .single();

            if (error) throw error;
            return { ...data, partnerExercise: data.partner_exercise, isWaiting: data.is_waiting };
        }
    },

    deleteExercise: async (id) => {
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    deleteWorkout: async (id) => {
        const response = await supabase
            .from('workouts')
            .delete({ count: 'exact' })
            .eq('id', id);

        return response;
    },

    // --- Workouts ---
    getAllWorkouts: async () => {
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data;
    },

    getWorkoutByDate: async (dateStr) => {
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('date', dateStr)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    saveWorkout: async (dateStr, exercises) => {
        // Check if exists
        const existing = await db.getWorkoutByDate(dateStr);

        const workoutData = {
            date: dateStr,
            exercises: exercises // stored as jsonb (now array of objects with waiting/main)
        };

        if (existing) {
            const { data, error } = await supabase
                .from('workouts')
                .update(workoutData)
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('workouts')
                .insert(workoutData)
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },

    // Generate 3 stops (Waiting + Main)
    generateWorkout: async () => {
        const allExercises = await db.getAllExercises();

        // Split into Waiting and Main
        const waitingPool = allExercises.filter(e => e.is_waiting);
        const mainPool = allExercises.filter(e => !e.is_waiting);

        if (waitingPool.length < 3 || mainPool.length < 3) {
            console.warn("Not enough exercises to generate full workout");
            // Fallback or just return what we can
        }

        // Shuffle both pools
        const shuffledWaiting = [...waitingPool].sort(() => 0.5 - Math.random());
        const shuffledMain = [...mainPool].sort(() => 0.5 - Math.random());

        // Create 3 stops
        const stops = [];
        for (let i = 0; i < 3; i++) {
            // Wrap safely in case we run out
            const waitingEx = shuffledWaiting[i % shuffledWaiting.length];
            const mainEx = shuffledMain[i % shuffledMain.length];

            stops.push({
                id: crypto.randomUUID(), // Unique ID for the stop itself
                stopNumber: i + 1,
                waiting: { ...waitingEx, partnerExercise: waitingEx.partner_exercise, isWaiting: true },
                main: { ...mainEx, partnerExercise: mainEx.partner_exercise, isWaiting: false }
            });
        }

        return stops;
    }
};
