"use client";
import React, { useState } from "react";
import Tabs from "@/components/Tabs";

export default function BookmarkPage() {
    const [activeTab, setActiveTab] = useState("Đã lưu");

    const bookmarks = [
        {
            title: "OpenAI",
            url: "https://openai.com",
            description: "Artificial Intelligence research and deployment company",
            favicon: "https://www.google.com/s2/favicons?domain=openai.com",
            folder: "AI",
        },
        {
            title: "MDN Web Docs",
            url: "https://developer.mozilla.org",
            description: "Resources for developers, by developers",
            favicon: "https://www.google.com/s2/favicons?domain=developer.mozilla.org",
            folder: "Docs",
        },
    ];

    const savedBookmarks = [
        {
            image: "https://cadentile.com/wp-content/uploads/2025/02/Broadway-White-ICE-MG-3x12-02-768x768.webp", // Replace with your real image URLs
            alt: "Notebook",
        },
        {
            image: "https://cadentile.com/wp-content/uploads/2025/02/Capella-Stone-Gray-12x24-02-768x768.webp",
            alt: "Book",
        },
        {
            image: "https://cadentile.com/wp-content/uploads/2025/02/Capella-Stone-Gray-24x48-02-768x768.webp",
            alt: "Dragon Art",
        },
        {
            image: "https://cadentile.com/wp-content/uploads/2025/02/Capella-Stone-Silver-12x24-02-768x768.webp",
            alt: "Food",
        },
        {
            image: "https://i.imgur.com/5.png",
            alt: "App UI",
        },
        {
            image: "https://i.imgur.com/6.png",
            alt: "Books",
        },
        {
            image: "https://i.imgur.com/7.png",
            alt: "Flower",
        },
    ];

    const savedContent = (
        <div className="w-full py-6 px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                {savedBookmarks.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl shadow p-4 flex items-center justify-center aspect-[3/4]"
                    >
                        <img
                            src={item.image}
                            alt={item.alt}
                            className="object-contain w-full h-full rounded-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
    const createdContent = (
        <div className="flex flex-wrap gap-4 justify-center mt-6">
            {/* Replace with your real data */}
            <div className="w-40 h-56 bg-white rounded-xl shadow flex items-center justify-center">Created 1</div>
            <div className="w-40 h-56 bg-white rounded-xl shadow flex items-center justify-center">Created 2</div>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <div className="w-full max-w-6xl">
                <Tabs
                    tabs={["Đã lưu", "Đã tạo"]}
                    activeTab={activeTab}
                    onTabClick={setActiveTab}
                />
                <div>
                    {activeTab === "Đã lưu" ? savedContent : createdContent}
                </div>
            </div>
        </main>
    );
}
