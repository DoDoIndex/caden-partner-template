import React from 'react';

export default function CustomFooter({ brandName }: { brandName: string }) {
    return (
        <footer className="w-full bg-gray-100 border-t mt-12">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-500 text-sm">
                <span>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</span>
                <span>Powered by Caden Partner</span>
            </div>
        </footer>
    );
} 