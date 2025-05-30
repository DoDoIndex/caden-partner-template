import { API_URL } from '@/app/config/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const form = await request.formData();
        const original = form.get('original') as File;
        const tile = form.get('tile') as File;
        const point_x = form.get('point_x');
        const point_y = form.get('point_y');

        // Tạo formData mới để forward sang backend
        const forwardForm = new FormData();
        forwardForm.append('original', original);
        forwardForm.append('tile', tile);
        forwardForm.append('point_x', point_x as string);
        forwardForm.append('point_y', point_y as string);

        const res = await fetch(`${API_URL}/api/design/replace-tile`, {
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
        return NextResponse.json({ error: 'Failed to process tile replacement' }, { status: 500 });
    }
}