import React, { useState, useEffect } from 'react';
import { X, Search, Info, Plus } from 'lucide-react';
import { db } from '../services/db';
import { cn } from '../lib/utils';

export function ExercisePickerModal({ isOpen, onClose, onSelect, type }) {
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newExercise, setNewExercise] = useState({
        name: '',
        category: 'Strength',
        description: '',
        partnerExercise: false
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadExercises();
            setIsCreating(false);
            setNewExercise({
                name: '',
                category: 'Strength',
                description: '',
                partnerExercise: false
            });
        }
    }, [isOpen, type]);

    const loadExercises = async () => {
        setLoading(true);
        try {
            const all = await db.getAllExercises();
            // Filter based on type
            const filtered = all.filter(ex =>
                type === 'waiting' ? ex.isWaiting : !ex.isWaiting
            );
            setExercises(filtered);
        } catch (error) {
            console.error("Failed to load exercises", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newExercise.name) return;

        setIsSaving(true);
        try {
            const exerciseToSave = {
                ...newExercise,
                isWaiting: type === 'waiting'
            };
            const saved = await db.saveExercise(exerciseToSave);
            onSelect(saved); // Automatically select the new exercise
        } catch (error) {
            console.error("Failed to create exercise:", error);
            alert("Failed to create exercise. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.category.toLowerCase().includes(search.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        {isCreating ? 'Create New Exercise' : `Select ${type === 'waiting' ? 'Waiting' : 'Main'} Exercise`}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isCreating ? (
                    <form onSubmit={handleCreate} className="p-4 space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={newExercise.name}
                                onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                                className="w-full p-2 rounded-lg border bg-background"
                                placeholder="e.g. Pushups"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                value={newExercise.category}
                                onChange={e => setNewExercise({ ...newExercise, category: e.target.value })}
                                className="w-full p-2 rounded-lg border bg-background"
                            >
                                <option value="Strength">Strength</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Mobility">Mobility</option>
                                <option value="Core">Core</option>
                                <option value="Plyometrics">Plyometrics</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                            <textarea
                                value={newExercise.description}
                                onChange={e => setNewExercise({ ...newExercise, description: e.target.value })}
                                className="w-full p-2 rounded-lg border bg-background resize-none h-24"
                                placeholder="Brief instructions..."
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="partner"
                                checked={newExercise.partnerExercise}
                                onChange={e => setNewExercise({ ...newExercise, partnerExercise: e.target.checked })}
                                className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
                            />
                            <label htmlFor="partner" className="text-sm font-medium">Partner Exercise</label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-2 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Create & Select'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {/* Search */}
                        <div className="p-4 border-b bg-muted/30">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search exercises..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {loading ? (
                                <div className="text-center py-8 text-muted-foreground">Loading...</div>
                            ) : filteredExercises.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground space-y-4">
                                    <p>No exercises found.</p>
                                    <button
                                        onClick={() => setIsCreating(true)}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
                                    >
                                        Create "{search}"
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsCreating(true)}
                                        className="w-full p-3 mb-2 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-primary font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create New Exercise
                                    </button>
                                    {filteredExercises.map(ex => (
                                        <button
                                            key={ex.id}
                                            onClick={() => onSelect(ex)}
                                            className="w-full text-left p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold group-hover:text-primary transition-colors">{ex.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{ex.category}</p>
                                                </div>
                                                {ex.partnerExercise && (
                                                    <span className="text-[10px] font-bold bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded">
                                                        Partner
                                                    </span>
                                                )}
                                            </div>
                                            {ex.description && (
                                                <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                                                    {ex.description}
                                                </p>
                                            )}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
