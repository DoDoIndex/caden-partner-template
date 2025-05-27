import { API_URL } from '@/app/config/api';
import { NextResponse } from 'next/server';

// POST request to send a message to the chat
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${API_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('API response was not ok');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in chat message route:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        );
    }
} 