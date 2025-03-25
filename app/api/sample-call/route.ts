import { NextRequest, NextResponse } from 'next/server';
export const revalidate = 0;
export async function GET(request: NextRequest) {
    const apiUrl = process.env.API_URL;

    try {
      const response = await fetch(`${apiUrl}/hello-binh`, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });
        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
      }
}
