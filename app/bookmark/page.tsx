"use client";
import React, { useState, useEffect } from "react";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import { Product } from "@/app/types/product";
import CardProduct from "@/app/components/Homepage/card-product";
import ListProduct from "@/app/components/Homepage/list-product";
import toast, { Toaster } from 'react-hot-toast';

export default function BookmarkPage() {
    const [activeTab, setActiveTab] = useState("Saved");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBookmark, setNewBookmark] = useState({
        title: "",
        category: "Wall Tile",
        size: "",
        image: ""
    });
    const [bookmarks, setBookmarks] = useState<Product[]>([]);

    const categories = [
        "All",
        "Vinyl Plank",
        "Wall Tile",
        "Floor Tile",
        "Mosaic",
        "Subway Tile",
        "Pool Tile",
        "Paver",
        "Slabs"
    ];

    useEffect(() => {
        const loadBookmarks = () => {
            try {
                if (typeof window !== 'undefined') {
                    const storedBookmarks = localStorage.getItem('bookmarks');
                    if (storedBookmarks) {
                        const parsedBookmarks = JSON.parse(storedBookmarks);
                        if (Array.isArray(parsedBookmarks)) {
                            // Chuyển đổi dữ liệu để phù hợp với interface Product
                            const validBookmarks = parsedBookmarks.map((bookmark: any) => ({
                                productId: Number(bookmark.productId),
                                collection: String(bookmark.collection),
                                name: String(bookmark.name),
                                texture: String(bookmark.texture),
                                material: String(bookmark.material),
                                size: String(bookmark.size),
                                sizeAdvance: String(bookmark.sizeAdvance),
                                unitOfMeasurement: String(bookmark.unitOfMeasurement),
                                quantityPerBox: Number(bookmark.quantityPerBox),
                                coverage: Number(bookmark.coverage),
                                unitPrice: Number(bookmark.unitPrice),
                                myUnitPrice: Number(bookmark.myUnitPrice),
                                weight: Number(bookmark.weight),
                                color: String(bookmark.color),
                                categories: String(bookmark.categories),
                                images: String(bookmark.images)
                            })) as Product[];
                            setBookmarks(validBookmarks);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading bookmarks:', error);
            }
        };

        loadBookmarks();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'bookmarks') {
                loadBookmarks();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorageChange);
            }
        };
    }, []);

    const handleCreateBookmark = () => {
        try {
            if (!newBookmark.title || !newBookmark.image) {
                console.error('Title and image are required');
                return;
            }

            const bookmark: Product = {
                productId: Date.now(),
                collection: newBookmark.category,
                name: newBookmark.title,
                texture: "",
                material: "",
                size: newBookmark.size,
                sizeAdvance: "",
                unitOfMeasurement: "",
                quantityPerBox: 0,
                coverage: 0,
                unitPrice: 0,
                myUnitPrice: 0,
                weight: 0,
                color: "",
                categories: newBookmark.category,
                images: newBookmark.image
            };

            const updatedBookmarks = [bookmark, ...bookmarks];
            setBookmarks(updatedBookmarks);
            if (typeof window !== 'undefined') {
                localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            }

            setShowCreateModal(false);
            setNewBookmark({
                title: "",
                category: "Wall Tile",
                size: "",
                image: ""
            });
        } catch (error) {
            console.error('Error creating bookmark:', error);
        }
    };

    const handleDeleteBookmark = (productId: number) => {
        try {
            const updatedBookmarks = bookmarks.filter(bookmark => bookmark.productId !== productId);
            setBookmarks(updatedBookmarks);
            if (typeof window !== 'undefined') {
                localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
                setTimeout(() => {
                    toast.success('Deleted from bookmark');
                    setBookmarks([...updatedBookmarks]);
                }, 100);
            }
        } catch (error) {
            console.error('Error deleting bookmark:', error);
            toast.error('Error deleting bookmark');
        }
    };

    const filteredBookmarks = bookmarks.filter((item) => {
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        const matchesCategory = selectedCategory === "All" || item.categories?.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    console.log('Current bookmarks:', bookmarks); // Debug log
    console.log('Filtered bookmarks:', filteredBookmarks); // Debug log

    const savedContent = (
        <div className="w-full py-4 sm:py-6">
            {/* Header Actions */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Bookmark
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-600"}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-600"}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search bookmarks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="title">Sort by Title</option>
                        </select>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {filteredBookmarks.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookmarks Yet</h3>
                    <p className="text-gray-600 mb-6">Start bookmarking your favorite items</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Bookmark
                    </button>
                </div>
            )}

            {/* Bookmarks Grid/List */}
            {filteredBookmarks.length > 0 ? (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    : "space-y-4"
                }>
                    {filteredBookmarks.map((product) => (
                        <div key={product.productId}>
                            {viewMode === 'grid' ? (
                                <CardProduct product={product} />
                            ) : (
                                <ListProduct product={product} />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No bookmarks found</p>
                    </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl w-full aspect-[3/4]">
                        <Image
                            src={previewImage}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Create Bookmark Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Create New Bookmark</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newBookmark.title}
                                    onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter bookmark title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={newBookmark.category}
                                    onChange={(e) => setNewBookmark({ ...newBookmark, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {categories.filter(cat => cat !== "All").map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                <input
                                    type="text"
                                    value={newBookmark.size}
                                    onChange={(e) => setNewBookmark({ ...newBookmark, size: e.target.value })}
                                    className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter size (e.g., 3x12)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={newBookmark.image}
                                    onChange={(e) => setNewBookmark({ ...newBookmark, image: e.target.value })}
                                    className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter image URL"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBookmark}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Create Bookmark
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const createdContent = (
        <div className="w-full py-4 sm:py-6">
            <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Collections Yet</h3>
                <p className="text-gray-600 mb-6">Create your first collection to get started</p>
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Collection
                </button>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="bg-white rounded-2xl shadow-sm">
                    <Tabs
                        tabs={["Saved", "Created"]}
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                    <div className="px-4 sm:px-6">
                        {activeTab === "Saved" ? savedContent : createdContent}
                    </div>
                </div>
            </div>
        </main>
    );
}
