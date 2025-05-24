import { API_URL } from '@/app/config/api';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(`${API_URL}/api/product`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('API response was not ok');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in get products route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${API_URL}/api/product`, {
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
        console.error('Error in create product route:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
} 