import React, { useState, useEffect } from 'react';
import { X, Search, Info } from 'lucide-react';
import { db } from '../services/db';
import { cn } from '../lib/utils';

export function ExercisePickerModal({ isOpen, onClose, onSelect, type }) {
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadExercises();
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
                        Select {type === 'waiting' ? 'Waiting' : 'Main'} Exercise
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

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
                        <div className="text-center py-8 text-muted-foreground">No exercises found.</div>
                    ) : (
                        filteredExercises.map(ex => (
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
