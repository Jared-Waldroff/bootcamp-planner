import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, CalendarClock, List } from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }) {
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
            >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
                <div className="relative flex items-center justify-center h-16 px-4 max-w-md mx-auto w-full">
                    {/* Logo on the left */}
                    <div className="absolute left-4 flex items-center">
                        <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-md object-contain" />
                    </div>

                    {/* Centered Text */}
                    <h1 className="text-xl font-bold tracking-tight text-primary">
                        Bootcamp Planner
                    </h1>

                    {/* Theme Toggle on the right */}
                    <div className="absolute right-4">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 container max-w-md mx-auto p-4 pb-24">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-10 h-16 border-t bg-card/80 backdrop-blur-sm safe-area-pb">
                <div className="flex h-full max-w-md mx-auto">
                    <NavItem to="/" icon={Dumbbell} label="Plan" />
                    <NavItem to="/exercises" icon={List} label="Exercises" />
                    <NavItem to="/history" icon={CalendarClock} label="History" />
                </div>
            </nav>
        </div>
    );
}
