import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

// GET /api/catalog
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        const url = queryString
            ? `${API_URL}/api/catalog?${queryString}`
            : `${API_URL}/api/catalog`;

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

        // Process the data to split Images field into arrays
        const processedData = Array.isArray(data.data) ? data.data : data;
        if (Array.isArray(processedData)) {
            processedData.forEach((product: any) => {
                if (product.productDetails?.Images && typeof product.productDetails.Images === 'string') {
                    product.productDetails.Images = product.productDetails.Images
                        .split('\n')
                        .map((url: string) => url.trim())
                        .filter((url: string) => url.length > 0);
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: processedData,
            total: data.total || processedData.length
        });
    } catch (error) {
        console.error('Error fetching catalog:', error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch catalog data"
            },
            { status: 500 }
        );
    }
}

// POST /api/catalog
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const url = `${API_URL}/api/catalog`;

        console.log('POST Request URL:', url);
        console.log('POST Request Body:', body);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data,
            message: 'Product created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create product"
            },
            { status: 500 }
        );
    }
}

// PUT /api/catalog/:id
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Product ID is required' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const url = `${API_URL}/api/catalog/product/details/${id}`;

        console.log('PUT Request URL:', url);
        console.log('PUT Request Body:', body);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update product"
            },
            { status: 500 }
        );
    }
}

// DELETE /api/catalog/:id
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Product ID is required' },
                { status: 400 }
            );
        }

        const url = `${API_URL}/api/catalog/${id}`;
        console.log('DELETE Request URL:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete product"
            },
            { status: 500 }
        );
    }
}