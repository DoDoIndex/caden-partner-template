import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const apiUrl = process.env.API_URL;

        if (!apiUrl) {
            console.error('API_URL environment variable is not defined');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (!resolvedParams.id) {
            console.error('Product ID is missing');
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const url = `${apiUrl}/api/catalog/products/${resolvedParams.id}`;
        console.log('GET Request URL:', url);
        console.log('API URL from env:', apiUrl);
        console.log('Product ID:', resolvedParams.id);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            return NextResponse.json(
                {
                    error: errorData?.message || `API error: ${response.status} ${response.statusText}`,
                    details: errorData
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data || !data.productDetails) {
            console.error('Invalid API Response:', data);
            return NextResponse.json(
                { error: 'Invalid product data received from API' },
                { status: 500 }
            );
        }

        // Xử lý chuỗi hình ảnh thành mảng
        if (data.productDetails.Images && typeof data.productDetails.Images === 'string') {
            const imageUrls = data.productDetails.Images
                .split('\n')
                .map((url: string) => url.trim())
                .filter((url: string) => url.length > 0);

            // Kiểm tra xem có URL hợp lệ không
            if (imageUrls.length === 0) {
                console.warn('No valid image URLs found in the response');
            }

            data.productDetails.Images = imageUrls;
        } else {
            console.warn('Images field is missing or not a string');
            data.productDetails.Images = [];
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in product details API route:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch product details',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 