import { API_URL } from '@/app/config/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${API_URL}/api/chat/search`, {
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
        console.error('Error in chat search route:', error);
        return NextResponse.json(
            { error: 'Failed to process search request' },
            { status: 500 }
        );
    }
} 