import React from 'react';
import { X, Users } from 'lucide-react';

export function ExerciseDetailModal({ exercise, onClose }) {
    if (!exercise) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                                {exercise.category}
                            </span>
                            <h3 className="text-2xl font-bold text-foreground leading-tight">
                                {exercise.name}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 -mt-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-muted-foreground" />
                        </button>
                    </div>

                    {exercise.partnerExercise && (
                        <div className="inline-flex items-center text-pink-500 bg-pink-500/10 px-3 py-1.5 rounded-lg text-sm font-bold">
                            <Users className="w-4 h-4 mr-2" />
                            Partner Exercise
                        </div>
                    )}

                    <div className="pt-2">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Instructions</h4>
                        <p className="text-foreground leading-relaxed">
                            {exercise.description || "No description available."}
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-muted/30 border-t">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
