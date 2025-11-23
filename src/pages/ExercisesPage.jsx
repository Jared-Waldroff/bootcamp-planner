import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';
import { db } from '../services/db';
import { ExerciseFormModal } from '../components/ExerciseFormModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { cn } from '../lib/utils';

import { EXERCISES } from '../data/exercises';

export function ExercisesPage() {
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [deletingExercise, setDeletingExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    const loadExercises = async () => {
        setIsLoading(true);
        try {
            const data = await db.getAllExercises();
            setExercises(data);
        } catch (error) {
            console.error("Failed to load exercises:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExercises();
    }, []);

    const handleSave = async (exercise) => {
        try {
            await db.saveExercise(exercise);
            await loadExercises(); // Reload to get fresh data
            setIsFormOpen(false);
            setEditingExercise(null);
        } catch (error) {
            console.error("Failed to save exercise:", error);
            alert("Failed to save exercise. Check console.");
        }
    };

    const handleDelete = async () => {
        if (deletingExercise) {
            try {
                await db.deleteExercise(deletingExercise.id);
                await loadExercises();
                setDeletingExercise(null);
            } catch (error) {
                console.error("Failed to delete exercise:", error);
                alert("Failed to delete exercise.");
            }
        }
    };

    const handleSeedData = async () => {
        setIsSeeding(true);
        try {
            // Sequentially add exercises to avoid rate limits or race conditions if any
            for (const ex of EXERCISES) {
                // Remove ID to let DB generate new UUIDs
                const { id, ...rest } = ex;
                await db.saveExercise(rest);
            }
            await loadExercises();
        } catch (error) {
            console.error("Failed to seed data:", error);
            alert("Failed to seed data. Check console.");
        } finally {
            setIsSeeding(false);
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Exercises</h2>
                <button
                    onClick={() => { setEditingExercise(null); setIsFormOpen(true); }}
                    className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search exercises..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-3 pb-20">
                    {filteredExercises.map(ex => (
                        <div key={ex.id} className="bg-card p-4 rounded-xl border shadow-sm flex items-center justify-between group hover:border-primary/50 transition-colors">
                            <div className="flex-1 min-w-0 mr-4">
                                {/* Type Label */}
                                {ex.isWaiting ? (
                                    <span className="text-[10px] font-bold text-orange-500/70 uppercase tracking-wider mb-0.5 block">
                                        Waiting
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider mb-0.5 block">
                                        Main
                                    </span>
                                )}

                                <h3 className="font-bold truncate text-base">{ex.name}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">{ex.category}</p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {ex.partnerExercise && (
                                    <div className="flex items-center text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                                        <Users className="w-3 h-3 mr-1" />
                                        Partner
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditingExercise(ex); setIsFormOpen(true); }}
                                        className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeletingExercise(ex)}
                                        className="p-2 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredExercises.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground space-y-4">
                            <p>No exercises found.</p>
                            {exercises.length === 0 && !search && (
                                <button
                                    onClick={handleSeedData}
                                    disabled={isSeeding}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isSeeding ? "Adding Defaults..." : "Add Default Exercises"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <ExerciseFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                exercise={editingExercise}
                onSave={handleSave}
            />

            <ConfirmationModal
                isOpen={!!deletingExercise}
                title="Delete Exercise?"
                message={`Are you sure you want to delete "${deletingExercise?.name}"? This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeletingExercise(null)}
                confirmText="Delete"
                isDestructive={true}
            />
        </div >
    );
}
