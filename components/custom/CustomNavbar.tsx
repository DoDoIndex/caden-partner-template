import React from 'react';

export default function CustomNavbar({ brandName }: { brandName: string }) {
    return (
        <nav className="w-full bg-white shadow sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Logo nếu có */}
                    {/* <img src="/logo.png" alt="Logo" className="h-8 w-8" /> */}
                    <span className="text-2xl font-bold text-primary tracking-wide">{brandName}</span>
                </div>
            </div>
        </nav>
    );
} 