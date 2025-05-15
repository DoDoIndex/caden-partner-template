'use client';

import { useState, useEffect, use } from 'react';
import { Product } from '@/app/types/product';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Not found product</h2>
                    <p className="mt-2 text-gray-600">This product does not exist or has been deleted</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Phần hình ảnh */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-xl overflow-hidden">
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
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
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Phần thông tin */}
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
                                        title={isBookmarked ? "Xóa khỏi bookmark" : "Thêm vào bookmark"}
                                    >
                                        <svg className={`w-6 h-6 ${isBookmarked ? 'text-sky-500 fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24">
                                            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        title="Chia sẻ sản phẩm"
                                    >
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                            <div className="space-y-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">${product.myUnitPrice}</span>
                                    <span className="text-gray-500">/ {product.unitOfMeasurement}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                                    <div>
                                        <p className="text-sm text-gray-500">Material</p>
                                        <p className="font-medium">{product.material}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Texture</p>
                                        <p className="font-medium">{product.texture}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Box Quantity</p>
                                        <p className="font-medium">{product.quantityPerBox} pcs</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Coverage</p>
                                        <p className="font-medium">{product.coverage} {product.unitOfMeasurement}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-900">Description</h3>
                                    <p className="text-gray-600">
                                        {product.material} {product.texture} Size: {product.size}.
                                        Collection: {product.collection},
                                        Quantity per box: {product.quantityPerBox},
                                        Coverage: {product.coverage} {product.unitOfMeasurement}.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                        Add to Bookmark
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 