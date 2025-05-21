'use client';

import { useState, useEffect, use } from 'react';
import { Product } from '@/app/types/product';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/catalog/product/details/${resolvedParams.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
                if (data?.productDetails?.Images && data.productDetails.Images.length > 0) {
                    setSelectedImage(data.productDetails.Images[0]);
                }

                // Kiểm tra trạng thái bookmark
                const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                setIsBookmarked(bookmarks.some((b: Product) => b.productId === data.productId));
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch product');
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
                title: product.productDetails.Name,
                text: `${product.productDetails.Material} - ${product.productDetails.Trim}`,
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
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">
                        <p>Error: {error}</p>
                    </div>
                ) : product ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Phần hình ảnh */}
                        <div className="space-y-4">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                                        {selectedImage && (
                                            <Image
                                                src={selectedImage}
                                                alt={product.productDetails?.Name || 'Product image'}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority
                                            />
                                        )}
                            </div>
                                    {product.productDetails?.Images && (Array.isArray(product.productDetails.Images) ? product.productDetails.Images.length > 1 : false) && (
                                        <Carousel className="w-full">
                                            <CarouselContent>
                                                {(Array.isArray(product.productDetails.Images) ? product.productDetails.Images : [product.productDetails.Images]).map((image: string, index: number) => (
                                                    <CarouselItem key={index} className="basis-1/4">
                                                        <button
                                                            onClick={() => setSelectedImage(image)}
                                                            className={`relative aspect-square overflow-hidden rounded-lg w-full h-full ${selectedImage === image ? 'ring-2 ring-primary' : ''}`}
                                                        >
                                                            <Image
                                                                src={image}
                                                                alt={`${product.productDetails?.Name || 'Product'} - Image ${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                                sizes="(max-width: 768px) 25vw, 12.5vw"
                                                            />
                                                        </button>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-0" />
                                            <CarouselNext className="right-0" />
                                        </Carousel>
                                    )}
                        </div>

                                {/* Phần thông tin sản phẩm */}
                                <div className="space-y-4 border-1 border-stone-200 rounded-lg shadow">
                                    <div className='bg-stone-200 p-4 rounded-lg'>
                                        <div className='flex justify-between'>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {product.productDetails?.Name}
                                            </h2>
                                            <div className='flex gap-1'>
                                                <button
                                                    onClick={handleBookmark}
                                                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${isBookmarked
                                                        ? 'bg-white text-amber-300 fill-current'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <Bookmark size={18} className={`${isBookmarked ? 'text-amber-300 fill-current' : 'text-gray-600'}`} />
                                                </button>
                                                <button
                                                    onClick={handleShare}
                                                    className="flex items-center gap-2 p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <Share2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-lg text-gray-600 font-semibold">
                                            Collection: {product.productDetails?.Collection}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="text-2xl font-bold text-primary">
                                                ${product.partnerPrice?.toFixed(2)}
                                            </p>
                                            {product.productDetails?.UOM && (
                                                <p className="text-sm text-gray-500">per {product.productDetails.UOM}</p>
                                            )}
                                </div>
                            </div>

                                    {/* Thông tin chi tiết */}
                                    <div className="border-t border-gray-200 pt-6 p-4">
                                        <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                                        <dl className="grid grid-cols-1 gap-4">
                                            {product.productDetails?.Color && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-600">Color</dt>
                                                    <dd className="text-gray-900">{product.productDetails.Color}</dd>
                                                </div>
                                            )}
                                            {product.productDetails?.Size && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-600">Size</dt>
                                                    <dd className="text-gray-900">{product.productDetails.Size}</dd>
                                                </div>
                                            )}
                                            {product.productDetails?.Material && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-600">Material</dt>
                                                    <dd className="text-gray-900">{product.productDetails.Material}</dd>
                                                </div>
                                            )}
                                            {product.productDetails?.["Color Group"] && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-600">Color Group</dt>
                                                    <dd className="text-gray-900">{product.productDetails["Color Group"]}</dd>
                                                </div>
                                            )}
                                            {product.productDetails?.["Qty per Box"] && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-600">Quantity per Box</dt>
                                                    <dd className="text-gray-900">{product.productDetails["Qty per Box"]}</dd>
                                                </div>
                                            )}
                                            {product.productDetails?.["Coverage (sqft)"] && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-600">Coverage</dt>
                                                    <dd className="text-gray-900">{product.productDetails["Coverage (sqft)"]} sqft</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    {/* Mô tả sử dụng */}
                                    {product.productDetails?.Usage && (
                                        <div className="border-t border-gray-200 pt-6 p-4">
                                            <h2 className="text-lg font-semibold mb-4">Usage</h2>
                                            <p className="text-gray-600 whitespace-pre-line">
                                                {product.productDetails.Usage}
                                    </p>
                                </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <p>No product found</p>
                    </div>
                )}
            </div>
        </div >
    );
} 