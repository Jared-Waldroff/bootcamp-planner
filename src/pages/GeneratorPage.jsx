import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, RefreshCw, Save, CheckCircle, Users, Info, Plus, Dumbbell, X } from 'lucide-react';
import { db } from '../services/db';
import { cn } from '../lib/utils';
import { ExerciseDetailModal } from '../components/ExerciseDetailModal';
import { ExercisePickerModal } from '../components/ExercisePickerModal';

export function GeneratorPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workout, setWorkout] = useState(null);
    const [generatedExercises, setGeneratedExercises] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Custom Plan State
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customStops, setCustomStops] = useState([
        { id: '1', stopNumber: 1, waiting: null, main: null },
        { id: '2', stopNumber: 2, waiting: null, main: null },
        { id: '3', stopNumber: 3, waiting: null, main: null },
    ]);
    const [pickerState, setPickerState] = useState({ isOpen: false, stopIndex: null, type: null });

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
                setIsCustomMode(false); // Reset custom mode on date change
                setCustomStops([
                    { id: '1', stopNumber: 1, waiting: null, main: null },
                    { id: '2', stopNumber: 2, waiting: null, main: null },
                    { id: '3', stopNumber: 3, waiting: null, main: null },
                ]);
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
            setIsCustomMode(false);
        } catch (error) {
            console.error("Failed to generate:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        const exercisesToSave = isCustomMode ? customStops : generatedExercises;
        if (!exercisesToSave) return;

        // Validate custom plan
        if (isCustomMode) {
            const isComplete = customStops.every(stop => stop.waiting && stop.main);
            if (!isComplete) {
                alert("Please select exercises for all stops before saving.");
                return;
            }
        }

        setIsLoading(true);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const saved = await db.saveWorkout(dateStr, exercisesToSave);
            setWorkout(saved);
            setGeneratedExercises(null); // Clear pending state
            setIsSaved(true);
            setIsCustomMode(false);
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Custom Plan Handlers
    const openPicker = (stopIndex, type) => {
        setPickerState({ isOpen: true, stopIndex, type });
    };

    const handleExerciseSelect = (exercise) => {
        const { stopIndex, type } = pickerState;

        if (isCustomMode) {
            const newStops = [...customStops];
            newStops[stopIndex] = {
                ...newStops[stopIndex],
                [type]: exercise
            };
            setCustomStops(newStops);
        } else {
            // If editing a saved workout or an already generated one
            const currentExercises = generatedExercises || (workout ? workout.exercises : []);
            const newExercises = [...currentExercises];
            newExercises[stopIndex] = {
                ...newExercises[stopIndex],
                [type]: exercise
            };
            setGeneratedExercises(newExercises);
        }

        setPickerState({ isOpen: false, stopIndex: null, type: null });
    };

    // Display either the saved workout, pending generated one, or custom plan
    const displayExercises = isCustomMode ? customStops : (generatedExercises || (workout ? workout.exercises : null));
    const isPending = !!generatedExercises || isCustomMode;
    return (
        <>
            <div className="h-full flex flex-col relative">
                <div className="flex items-center justify-between p-4 border-b bg-card z-10 sticky top-0">
                    <button
                        onClick={() => handleDateChange(-1)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h1 className="font-bold text-lg">Workout Generator</h1>
                        <p className="text-xs text-muted-foreground">{format(selectedDate, 'EEEE, MMM do')}</p>
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
                            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isLoading ? "Generating..." : "Generate Workout"}
                                </button>
                                <button
                                    onClick={() => setIsCustomMode(true)}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-muted text-foreground rounded-xl font-semibold text-base hover:bg-muted/80 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Custom Plan
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    {isPending ? (isCustomMode ? "Custom Plan" : "Preview Workout") : "Planned Workout"}
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
                                    const isLegacy = !stop.waiting && !isCustomMode;

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
                                            {isCustomMode && !stop.waiting ? (
                                                <button
                                                    onClick={() => openPicker(idx, 'waiting')}
                                                    className="w-full text-left p-4 border-b hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground border-dashed"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Select Waiting Exercise
                                                </button>
                                            ) : (
                                                <div className="w-full flex border-b hover:bg-muted/50 transition-colors group">
                                                    <button
                                                        onClick={() => setSelectedExercise(stop.waiting)}
                                                        className="flex-1 text-left p-4"
                                                    >
                                                        <span className="text-[10px] font-bold text-orange-500/70 uppercase tracking-wider mb-0.5 block">
                                                            Waiting
                                                        </span>
                                                        <h3 className="font-bold group-hover:text-primary transition-colors">{stop.waiting?.name}</h3>
                                                    </button>
                                                    <div className="p-4 flex items-start">
                                                        <button
                                                            onClick={() => openPicker(idx, 'waiting')}
                                                            className="p-1 text-muted-foreground/50 hover:text-primary transition-colors"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Main Exercise */}
                                            {isCustomMode && !stop.main ? (
                                                <button
                                                    onClick={() => openPicker(idx, 'main')}
                                                    className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground border-dashed"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Select Main Exercise
                                                </button>
                                            ) : (
                                                <div className="w-full flex hover:bg-muted/50 transition-colors group">
                                                    <button
                                                        onClick={() => setSelectedExercise(stop.main)}
                                                        className="flex-1 text-left p-4"
                                                    >
                                                        <span className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider mb-0.5 block">
                                                            Main
                                                        </span>
                                                        <h3 className="font-bold group-hover:text-primary transition-colors">{stop.main?.name}</h3>
                                                        <p className="text-xs text-muted-foreground mt-1">{stop.main?.category}</p>
                                                    </button>
                                                    <div className="p-4 flex flex-col items-end gap-2">
                                                        <button
                                                            onClick={() => openPicker(idx, 'main')}
                                                            className="p-1 text-muted-foreground/50 hover:text-primary transition-colors"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                        {stop.main?.partnerExercise && (
                                                            <div className="flex items-center text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                <Users className="w-3 h-3 mr-1" />
                                                                Partner
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto flex flex-col gap-3 z-10">
                                {isPending ? (
                                    <>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isLoading}
                                            className="w-full py-3 bg-muted text-muted-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-muted/80 hover:text-foreground transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                            Regenerate
                                        </button>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setGeneratedExercises(null);
                                                    setIsCustomMode(false);
                                                }}
                                                disabled={isLoading}
                                                className="flex-1 py-3 bg-muted text-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-muted/80 disabled:opacity-50"
                                            >
                                                <X className="w-5 h-5" />
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleConfirm}
                                                disabled={isLoading}
                                                className="flex-[2] py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50"
                                            >
                                                <Save className="w-5 h-5" />
                                                {isLoading ? "Saving..." : "Confirm & Save"}
                                            </button>
                                        </div>
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

            {/* Modals */}
            <ExerciseDetailModal
                exercise={selectedExercise}
                onClose={() => setSelectedExercise(null)}
            />

            <ExercisePickerModal
                isOpen={pickerState.isOpen}
                onClose={() => setPickerState({ ...pickerState, isOpen: false })}
                onSelect={handleExerciseSelect}
                type={pickerState.type}
            />
        </>
    );
}
