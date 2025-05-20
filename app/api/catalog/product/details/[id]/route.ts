import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const apiUrl = process.env.API_URL;
        if (!apiUrl) {
            throw new Error('API_URL is not defined');
        }

        const url = `${apiUrl}/api/catalog/product/details?productId=${resolvedParams.id}`;
        console.log('GET Request URL:', url);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching product details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
        );
    }
} 