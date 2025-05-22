import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(request: Request) {
    try {
        const url = `${API_URL}/api/catalog/images`;
        console.log('GET Request URL:', url);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data: data.data || data
        });
    } catch (error) {
        console.error('Error fetching catalog images:', error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch catalog images"
            },
            { status: 500 }
        );
    }
} 