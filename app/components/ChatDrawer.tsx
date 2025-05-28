"use client";

import { useState } from 'react';
import { BotMessageSquare, X } from 'lucide-react';
import ChatInterface from './ChatInterface';

export default function ChatDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`p-4 rounded-full shadow-lg transition-colors ${isOpen
                    ? 'hidden'
                    : 'bg-gray-600 hover:bg-gray-700'
                    }`}
            >
                <BotMessageSquare className="text-white" size={28} />
            </button>

            {/* Chat Drawer */}
            <div
                className={`fixed bottom-20 right-4 w-full md:w-[600px] lg:w-[800px] bg-white rounded-lg shadow-xl transition-all duration-300 transform ${isOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                    }`}
                style={{
                    height: 'calc(100vh - 8rem)',
                    maxWidth: 'calc(100vw - 2rem)',
                    maxHeight: 'calc(100vh - 6rem)'
                }}
            >
                {isOpen && (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 z-20 text-2xl text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 shadow"
                        aria-label="Close chat drawer"
                    >
                        <X size={28} />
                    </button>
                )}
                <div className="h-full">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
} 