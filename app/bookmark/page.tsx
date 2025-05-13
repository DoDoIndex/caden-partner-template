"use client";
import React, { useState } from "react";
import Tabs from "@/components/Tabs";

export default function BookmarkPage() {
    const [activeTab, setActiveTab] = useState("Saved");
    const [viewMode, setViewMode] = useState("grid");

    const savedBookmarks = [
        {
            id: 1,
            image: "https://cadentile.com/wp-content/uploads/2025/02/Broadway-White-ICE-MG-3x12-02-768x768.webp",
            title: "Broadway White ICE",
            category: "Wall Tile",
            date: "2024-03-15",
            size: "3x12"
        },
        {
            id: 2,
            image: "https://cadentile.com/wp-content/uploads/2025/02/Capella-Stone-Gray-12x24-02-768x768.webp",
            title: "Capella Stone Gray",
            category: "Floor Tile",
            date: "2024-03-14",
            size: "12x24"
        },
        {
            id: 3,
            image: "https://cadentile.com/wp-content/uploads/2025/02/Capella-Stone-Gray-24x48-02-768x768.webp",
            title: "Capella Stone Gray",
            category: "Floor Tile",
            date: "2024-03-13",
            size: "24x48"
        },
        {
            id: 4,
            image: "https://cadentile.com/wp-content/uploads/2025/02/Capella-Stone-Silver-12x24-02-768x768.webp",
            title: "Capella Stone Silver",
            category: "Floor Tile",
            date: "2024-03-12",
            size: "12x24"
        }
    ];

    const savedContent = (
        <div className="w-full py-4 sm:py-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Collection
                    </button>
                    <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Add to Folder
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

            {/* Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {savedBookmarks.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            <div className="aspect-[3/4] relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>{item.category}</span>
                                    <span>•</span>
                                    <span>{item.size}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
                <div className="space-y-4">
                    {savedBookmarks.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4"
                        >
                            <div className="w-full sm:w-24 h-24 flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600">
                                    <span>{item.category}</span>
                                    <span>•</span>
                                    <span>{item.size}</span>
                                    <span>•</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
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
