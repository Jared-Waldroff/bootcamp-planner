import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, RefreshCw, Save, CheckCircle, Users, Info } from 'lucide-react';
import { db } from '../services/db';
import { cn } from '../lib/utils';
import { ExerciseDetailModal } from '../components/ExerciseDetailModal';

export function GeneratorPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workout, setWorkout] = useState(null);
    const [generatedExercises, setGeneratedExercises] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load workout for selected date
    useEffect(() => {
        const loadWorkout = async () => {
            setIsLoading(true);
            try {
                const dateStr = format(selectedDate, 'yyyy-MM-dd');
                const existing = await db.getWorkoutByDate(dateStr);
                setWorkout(existing);
                setGeneratedExercises(null);
                setIsSaved(!!existing);
            } catch (error) {
                console.error("Failed to load workout:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadWorkout();
    }, [selectedDate]);

    const handleDateChange = (days) => {
        const newDate = addDays(selectedDate, days);
        setSelectedDate(newDate);
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const exercises = await db.generateWorkout();
            setGeneratedExercises(exercises);
            setIsSaved(false);
        } catch (error) {
            console.error("Failed to generate:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!generatedExercises) return;
        setIsLoading(true);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const saved = await db.saveWorkout(dateStr, generatedExercises);
            setWorkout(saved);
            setGeneratedExercises(null); // Clear pending state
            setIsSaved(true);
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Display either the saved workout or the pending generated one
    const displayExercises = generatedExercises || (workout ? workout.exercises : null);
    const isPending = !!generatedExercises;

    return (
        <>
            <div className="space-y-6">
                {/* Date Picker */}
                <div className="flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm">
                    <button
                        onClick={() => handleDateChange(-1)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">
                            {format(selectedDate, 'EEEE')}
                        </div>
                        <div className="text-2xl font-bold">
                            {format(selectedDate, 'MMM d')}
                        </div>
                    </div>
                    <button
                        onClick={() => handleDateChange(1)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    {!displayExercises ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <Dumbbell className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No workout planned for this day.</p>
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isLoading ? "Generating..." : "Generate Workout"}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    {isPending ? "Preview Workout" : "Planned Workout"}
                                </h2>
                                {isSaved && !isPending && (
                                    <span className="flex items-center text-green-500 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Saved
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {displayExercises.map((stop, idx) => {
                                    // Handle legacy data format (if any old workouts exist without 'waiting' key)
                                    const isLegacy = !stop.waiting;

                                    if (isLegacy) {
                                        return (
                                            <div key={stop.id || idx} className="p-4 rounded-xl border bg-card text-muted-foreground">
                                                Legacy Workout Format (Regenerate to update)
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={stop.id || idx} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                                            <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                    Stop {idx + 1}
                                                </span>
                                            </div>

                                            {/* Waiting Exercise */}
                                            <button
                                                onClick={() => setSelectedExercise(stop.waiting)}
                                                className="w-full text-left p-4 border-b hover:bg-muted/50 transition-colors flex justify-between items-start group"
                                            >
                                                <div>
                                                    <span className="text-[10px] font-bold text-orange-500/70 uppercase tracking-wider mb-0.5 block">
                                                        Waiting
                                                    </span>
                                                    <h3 className="font-bold group-hover:text-primary transition-colors">{stop.waiting.name}</h3>
                                                </div>
                                                <Info className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                            </button>

                                            {/* Main Exercise */}
                                            <button
                                                onClick={() => setSelectedExercise(stop.main)}
                                                className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex justify-between items-start group"
                                            >
                                                <div>
                                                    <span className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider mb-0.5 block">
                                                        Main
                                                    </span>
                                                    <h3 className="font-bold group-hover:text-primary transition-colors">{stop.main.name}</h3>
                                                    <p className="text-xs text-muted-foreground mt-1">{stop.main.category}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Info className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                                    {stop.main.partnerExercise && (
                                                        <div className="flex items-center text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                                                            <Users className="w-3 h-3 mr-1" />
                                                            Partner
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto flex gap-3 z-10">
                                {isPending ? (
                                    <>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isLoading}
                                            className="flex-1 py-3 bg-muted text-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-muted/80 disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                            Retry
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            disabled={isLoading}
                                            className="flex-[2] py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            <Save className="w-5 h-5" />
                                            {isLoading ? "Saving..." : "Confirm & Save"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isLoading}
                                        className="w-full py-3 bg-muted text-muted-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-muted/80 hover:text-foreground transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                        Regenerate
                                    </button>
                                )}
                            </div>
                            {/* Spacer for fixed bottom buttons */}
                            <div className="h-20" />
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            <ExerciseDetailModal
                exercise={selectedExercise}
                onClose={() => setSelectedExercise(null)}
            />
        </>
    );
}

function Dumbbell({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m6.5 6.5 11 11" />
            <path d="m21 21-1-1" />
            <path d="m3 3 1 1" />
            <path d="m18 22 4-4" />
            <path d="m2 6 4-4" />
            <path d="m3 10 7-7" />
            <path d="m14 21 7-7" />
        </svg>
    )
}
