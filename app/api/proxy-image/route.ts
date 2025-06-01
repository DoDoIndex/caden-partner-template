import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const imageUrl = req.nextUrl.searchParams.get('url');
    if (!imageUrl) {
        return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
        }
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();
        return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
    }
} 