import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Users, Trash2 } from 'lucide-react';
import { db } from '../services/db';
import { ConfirmationModal } from '../components/ConfirmationModal';

export function HistoryPage() {
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingWorkout, setDeletingWorkout] = useState(null);

    const loadWorkouts = async () => {
        try {
            const allWorkouts = await db.getAllWorkouts();
            setWorkouts(allWorkouts);
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadWorkouts();
    }, []);

    const handleDelete = async () => {
        if (deletingWorkout) {
            try {
                const response = await db.deleteWorkout(deletingWorkout.id);

                if (response && response.count === 0) {
                    alert(`Failed to delete: No record found with ID ${deletingWorkout.id}. Check permissions.`);
                } else {
                    await loadWorkouts();
                    setDeletingWorkout(null);
                }
            } catch (error) {
                console.error("Failed to delete workout:", error);
                alert(`Failed to delete workout: ${error.message}`);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (workouts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No past workouts found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold px-1">Workout History</h2>
            <div className="space-y-4">
                {workouts.map((workout) => (
                    <div key={workout.id} className="bg-card border rounded-xl overflow-hidden shadow-sm group">
                        <div className="bg-muted/50 px-4 py-3 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-foreground">
                                    {format(parseISO(workout.date), 'EEEE, MMM d, yyyy')}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {workout.exercises.length} Exercises
                                </span>
                            </div>
                            <button
                                onClick={() => setDeletingWorkout(workout)}
                                className="p-2 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete Workout"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="divide-y">
                            {workout.exercises.map((stop, idx) => {
                                // Legacy support
                                if (!stop.waiting) {
                                    return (
                                        <div key={idx} className="px-4 py-3 flex items-center justify-between opacity-50">
                                            <div>
                                                <span className="text-xs text-muted-foreground uppercase mr-2">Stop {idx + 1}</span>
                                                <span className="font-medium">{stop.name}</span>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={idx} className="p-4 hover:bg-muted/20 transition-colors">
                                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                                            Stop {idx + 1}
                                        </div>

                                        <div className="space-y-4 pl-2 border-l-2 border-muted">
                                            {/* Waiting */}
                                            <div>
                                                <span className="text-[10px] font-bold text-orange-500/70 uppercase tracking-wider mb-0.5 block">
                                                    Waiting
                                                </span>
                                                <div className="font-medium text-sm">{stop.waiting.name}</div>
                                            </div>

                                            {/* Main */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider mb-0.5 block">
                                                        Main
                                                    </span>
                                                    <div className="font-medium text-sm">{stop.main.name}</div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5">{stop.main.category}</div>
                                                </div>
                                                {stop.main.partnerExercise && (
                                                    <div className="flex items-center text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                                                        <Users className="w-3 h-3 mr-1" />
                                                        Partner
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmationModal
                isOpen={!!deletingWorkout}
                title="Delete Workout?"
                message={`Are you sure you want to delete the workout for ${deletingWorkout ? format(parseISO(deletingWorkout.date), 'MMM d, yyyy') : ''}? This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeletingWorkout(null)}
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
}
