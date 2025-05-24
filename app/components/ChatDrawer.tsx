"use client";

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatInterface from './ChatInterface';

export default function ChatDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-colors ${isOpen
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                    }`}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <MessageCircle className="h-6 w-6 text-gray-600" />
                )}
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
                <div className="h-full">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
} 