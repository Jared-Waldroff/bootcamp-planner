import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground" />
            ) : (
                <Sun className="w-5 h-5 text-foreground" />
            )}
        </button>
    );
}
