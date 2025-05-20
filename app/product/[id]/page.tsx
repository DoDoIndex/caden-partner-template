'use client';

import { useState, useEffect, use } from 'react';
import { Product } from '@/app/types/product';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/catalog/product/details/${resolvedParams.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProduct(data);
                setSelectedImage(data.images);

                // Kiểm tra trạng thái bookmark
                const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                setIsBookmarked(bookmarks.some((b: Product) => b.productId === data.productId));
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Cannot load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [resolvedParams.id]);

    const handleBookmark = () => {
        if (!product) return;

        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

        if (isBookmarked) {
            const newBookmarks = bookmarks.filter((b: Product) => b.productId !== product.productId);
            localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
            setIsBookmarked(false);
            toast.success('Deleted from bookmark');
        } else {
            bookmarks.push(product);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            setIsBookmarked(true);
            toast.success('Successfully added to bookmark');
        }
    };

    const handleShare = () => {
        if (navigator.share && product) {
            navigator.share({
                title: product.name,
                text: `${product.material} - ${product.texture}`,
                url: window.location.href,
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Product Not Found</h2>
                    <p className="mt-2 text-gray-600">This product does not exist or has been deleted</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Products</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    width={800}
                                    height={800}
                                    className="object-contain w-full h-full"
                                    priority
                                    unoptimized
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <button
                                    onClick={() => setSelectedImage(product.images)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === product.images ? 'border-primary' : 'border-transparent'
                                        }`}
                                >
                                    <Image
                                        src={product.images}
                                        alt={product.name}
                                        width={200}
                                        height={200}
                                        className="object-contain w-full h-full"
                                        unoptimized
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                        {product.collection}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                                        {product.size}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleBookmark}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                                    >
                                        <Bookmark
                                            size={24}
                                            className={isBookmarked ? 'text-primary fill-current' : 'text-gray-600'}
                                        />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        title="Share product"
                                    >
                                        <Share2 size={24} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                            <div className="space-y-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">${product.myUnitPrice}</span>
                                    <span className="text-gray-500">/ {product.unitOfMeasurement}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 py-6 border-t border-b">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Material</p>
                                        <p className="font-medium text-gray-900">{product.material}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Texture</p>
                                        <p className="font-medium text-gray-900">{product.texture}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Box Quantity</p>
                                        <p className="font-medium text-gray-900">{product.quantityPerBox} pcs</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Coverage</p>
                                        <p className="font-medium text-gray-900">
                                            {product.coverage} {product.unitOfMeasurement}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-900">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.material} {product.texture} Size: {product.size}.
                                        Collection: {product.collection},
                                        Quantity per box: {product.quantityPerBox},
                                        Coverage: {product.coverage} {product.unitOfMeasurement}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 