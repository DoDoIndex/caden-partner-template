import React from "react";

interface TabsProps {
    tabs: string[];
    activeTab: string;
    onTabClick: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabClick }: TabsProps) {
    return (
        <div className="flex border-b border-gray-200 w-full justify-center">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`px-4 py-2 text-lg font-medium focus:outline-none transition
            ${activeTab === tab
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-black"
                        }`}
                    onClick={() => onTabClick(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}