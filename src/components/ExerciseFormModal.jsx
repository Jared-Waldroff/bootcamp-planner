import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EXERCISE_CATEGORIES } from '../data/exercises';
import { ConfirmationModal } from './ConfirmationModal';

export function ExerciseFormModal({ exercise, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        category: EXERCISE_CATEGORIES[0],
        partnerExercise: false,
        isWaiting: false,
        description: ''
    });
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (exercise) {
            setFormData({
                name: exercise.name,
                category: exercise.category,
                partnerExercise: exercise.partnerExercise,
                isWaiting: exercise.isWaiting || false,
                description: exercise.description || ''
            });
        } else {
            setFormData({
                name: '',
                category: EXERCISE_CATEGORIES[0],
                partnerExercise: false,
                isWaiting: false,
                description: ''
            });
        }
    }, [exercise, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmSave = () => {
        onSave({ ...formData, id: exercise?.id });
        setShowConfirm(false);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="text-lg font-bold">{exercise ? 'Edit Exercise' : 'New Exercise'}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Burpees"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            >
                                {EXERCISE_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-xl bg-muted/20">
                                <input
                                    type="checkbox"
                                    id="partner"
                                    checked={formData.partnerExercise}
                                    onChange={e => setFormData({ ...formData, partnerExercise: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="partner" className="text-sm font-medium cursor-pointer">Partner</label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 border rounded-xl bg-muted/20">
                                <input
                                    type="checkbox"
                                    id="waiting"
                                    checked={formData.isWaiting}
                                    onChange={e => setFormData({ ...formData, isWaiting: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="waiting" className="text-sm font-medium cursor-pointer">Waiting</label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[100px]"
                                placeholder="How to perform this exercise..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-all active:scale-95 mt-4"
                        >
                            {exercise ? 'Update Exercise' : 'Create Exercise'}
                        </button>
                    </form>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                title={exercise ? "Update Exercise?" : "Create Exercise?"}
                message={`Are you sure you want to ${exercise ? 'update' : 'add'} "${formData.name}"?`}
                onConfirm={handleConfirmSave}
                onCancel={() => setShowConfirm(false)}
                confirmText="Yes, Save"
            />
        </>
    );
}
