import React from 'react';

export function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center space-y-4">
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    <p className="text-muted-foreground">{message}</p>
                </div>
                <div className="flex border-t divide-x">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 text-sm font-semibold hover:bg-muted transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${isDestructive ? "text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
