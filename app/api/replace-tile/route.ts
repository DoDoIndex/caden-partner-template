import { NextResponse } from 'next/server';

const LOCAL_API_URL = process.env.LOCAL_API_URL || 'http://localhost:8000/api';

export async function POST(request: Request) {
    try {
        const form = await request.formData();
        const original = form.get('original') as File;
        const tile = form.get('tile') as File;
        const point_x = form.get('point_x');
        const point_y = form.get('point_y');

        // Tạo formData mới để forward sang API gốc
        const forwardForm = new FormData();
        forwardForm.append('original', original);
        forwardForm.append('tile', tile);
        forwardForm.append('point_x', point_x as string);
        forwardForm.append('point_y', point_y as string);

        const res = await fetch(`${LOCAL_API_URL}/replace-tile/`, {
            method: 'POST',
            body: forwardForm,
        });

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
            const arrayBuffer = await res.arrayBuffer();
            return new Response(arrayBuffer, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                },
            });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to call replace-tile API' }, { status: 500 });
    }
} 