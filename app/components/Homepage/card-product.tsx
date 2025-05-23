'use client';

import { Product } from "@/app/types/product";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export interface CardProductProps {
    product: Product;
}

export default function CardProduct({ product }: CardProductProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showJson, setShowJson] = useState(false);
    const productJson = JSON.stringify(product, null, 2);

    useEffect(() => {
        // Kiểm tra trạng thái bookmark từ localStorage khi component mount
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.some((bookmark: Product) => bookmark.productId === product.productId));
    }, [product.productId]);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

        if (isBookmarked) {
            const newBookmarks = bookmarks.filter((bookmark: Product) => bookmark.productId !== product.productId);
            localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
            setIsBookmarked(false);
            toast.success('Deleted from bookmark');
        } else {
            bookmarks.push(product);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            setIsBookmarked(true);
            toast.success('Successfully added to bookmark');
        }
        // Thông báo cho các tab/component khác cập nhật lại bookmarks
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('bookmarks-updated'));
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: product.productDetails.Name,
                text: `${product.productDetails.Material} - ${product.productDetails.Trim}`,
                url: window.location.href,
            });
        }
    };

    const handleProductClick = () => {
        router.push(`/product/${product.productId}`);
    };

    return (
        <div
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={handleProductClick}>
                {product.productDetails.Images && (
                    <img
                        src={Array.isArray(product.productDetails.Images) ? product.productDetails.Images[0] : product.productDetails.Images}
                        alt={product.productDetails.Name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                )}

                {/* Quick Actions */}
                <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={handleBookmark}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                    >
                        <svg className={`w-5 h-5 ${isBookmarked ? 'text-amber-600 fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24">
                            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        title="Share product"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between flex-1 p-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {product.productDetails.Collection}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            {product.productDetails.Size}
                        </span>
                    </div>
                    <h3
                        className="font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-primary"
                        onClick={handleProductClick}
                    >
                        {product.productDetails.Name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.productDetails.Material} - {product.productDetails.Trim}</p>
                </div>
                <div>
                    <div className="flex flex-col items-start justify-between">
                        <div>
                            <span className="text-lg font-semibold text-primary">${product.productDetails.unit_price}</span>
                            <span className="text-sm text-gray-500 ml-2">/ {product.productDetails.UOM}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="block">Box: {product.productDetails["Qty per Box"]} pcs</span>
                            <span className="block">Coverage: {product.productDetails["Coverage (sqft)"]} {product.productDetails.UOM}</span>
                        </div>
                    </div>
                    {showJson && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <pre className="text-xs text-gray-600 overflow-auto">
                                {productJson}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 