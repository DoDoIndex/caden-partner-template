import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, email, phoneNumber, companyName, message } = body;

        // Validate required fields
        if (!fullName || !email || !phoneNumber || !companyName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Forward the request to your backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partner-registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                phoneNumber,
                companyName,
                message
            }),
        });

        // Read the response as text ONCE
        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            data = null;
        }

        if (!response.ok) {
            throw new Error((data && data.error) || responseText || 'Failed to submit registration');
        }

        return NextResponse.json(
            { message: (data && data.message) || responseText || 'Registration submitted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in partner registration:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to submit registration' },
            { status: 500 }
        );
    }
} 