'use client';

import { ListFilter, X } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/app/types/product";
import React from "react";

const categories = [
    "All products",
    "Luxury Vinyl Planks",
    "Pool Plaster",
    "Tiles"
];

const materials = [
    "Ceramic",
    "Glass",
    "Natural Stone",
    "Porcelain"
];

const usages = [
    "Outdoor Walls",
    "Outdoor Floors",
    "Indoor Walls",
    "Indoor Floors",
    "Shower Walls",
    "Shower Floors",
    "Heated Floors",
    "Commercial Floors",
    "Steam Rooms",
    "Swimming Pools"
];

const colors = [
    { name: "Red", value: "red", bgColor: "bg-red-500" },
    { name: "Orange", value: "orange", bgColor: "bg-amber-500" },
    { name: "Yellow", value: "yellow", bgColor: "bg-yellow-300" },
    { name: "Beige", value: "beige", bgColor: "bg-amber-100" },
    { name: "Green", value: "green", bgColor: "bg-green-300" },
    { name: "Teal", value: "teal", bgColor: "bg-teal-500" },
    { name: "Blue", value: "blue", bgColor: "bg-blue-300" },
    { name: "Purple", value: "purple", bgColor: "bg-purple-300" },
    { name: "Pink", value: "pink", bgColor: "bg-pink-300" },
    { name: "Brown", value: "brown", bgColor: "bg-rose-900" },
    { name: "Grey", value: "grey", bgColor: "bg-gray-500" },
    { name: "Black", value: "black", bgColor: "bg-black" },
    { name: "White", value: "white", bgColor: "bg-gray-50" },
];

interface Filters {
    categories: string[];
    materials: string[];
    usages: string[];
    colors: string[];
}

interface SidebarProps {
    products: Product[];
    onFilterChange: (filteredProducts: Product[]) => void;
}

export default function Sidebar({ products, onFilterChange }: SidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        categories: [],
        materials: [],
        usages: [],
        colors: [],
    });

    // Cập nhật filters từ URL ban đầu (1 lần)
    useEffect(() => {
        const getInitialFilters = () => {
            const getArray = (key: string) => searchParams.get(key)?.split(',') || [];

            return {
                categories: getArray('categories'),
                materials: getArray('materials'),
                usages: getArray('usages'),
                colors: getArray('colors'),
            };
        };

        const initial = getInitialFilters();
        setFilters(initial);
    }, []);

    // Tách logic lọc thành một hàm riêng và tối ưu normalize
    const filterProducts = React.useCallback((products: Product[], currentFilters: Filters) => {
        if (!products || !Array.isArray(products)) return [];
        const normalize = (arr: string[]) => arr.map(s => s.toLowerCase().trim());

        const normFilters = {
            categories: normalize(currentFilters.categories),
            materials: normalize(currentFilters.materials),
            usages: normalize(currentFilters.usages),
            colors: normalize(currentFilters.colors),
        };

        return products.filter(product => {
            const productCategory = product.productDetails?.Categories?.toLowerCase() || '';
            const productMaterial = product.productDetails?.Material?.toLowerCase() || '';
            const productUsage = product.productDetails?.Usage?.toLowerCase() || '';
            const productColorGroups = (product.productDetails?.["Color Group"]?.toLowerCase() || '').split('\n');

            if (normFilters.categories.length && !normFilters.categories.includes('all products')) {
                const match = normFilters.categories.some(c => productCategory.includes(c));
                if (!match) return false;
            }

            if (normFilters.materials.length) {
                const match = normFilters.materials.some(m => productMaterial.includes(m));
                if (!match) return false;
            }

            if (normFilters.usages.length) {
                const match = normFilters.usages.some(u => productUsage.includes(u));
                if (!match) return false;
            }

            if (normFilters.colors.length) {
                const match = normFilters.colors.some(color =>
                    productColorGroups.some(group => group.includes(color))
                );
                if (!match) return false;
            }

            return true;
        });
    }, []);


    // Lọc sản phẩm khi filters thay đổi
    useEffect(() => {
        const filtered = filterProducts(products, filters);
        onFilterChange(filtered);
    }, [products, filters, filterProducts, onFilterChange]);


    // Xử lý thay đổi filter từ checkbox
    const handleFilterChange = (type: keyof Filters, value: string) => {
        setFilters(prev => {
            let updated: string[];
            if (type === 'categories' && value === 'All products') {
                // Nếu chọn All products thì chỉ chọn nó
                return { ...prev, categories: ['All products'] };
            }
            if (type === 'categories' && value !== 'All products') {
                updated = prev.categories.includes(value)
                    ? prev.categories.filter(v => v !== value)
                    : [...prev.categories.filter(v => v !== 'All products'), value];
                return { ...prev, categories: updated };
            }
            // Các filter khác
            updated = prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value];
            return { ...prev, [type]: updated };
        });
    };

    // Cập nhật URL khi filters thay đổi
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, values]) => {
            if (values.length > 0) params.set(key, values.join(','));
        });
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.replace(newUrl, { scroll: false });
    }, [filters]);

    // Xoá toàn bộ filter và URL params
    const clearFilters = () => {
        setFilters({
            categories: [],
            materials: [],
            usages: [],
            colors: [],
        });
        router.replace('', { scroll: false });
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden fixed bottom-6 left-6 z-50 bg-stone-500 text-white p-4 rounded-full shadow-lg hover:bg-stone-600 transition-colors ${isOpen ? 'hidden' : 'block'}`}
            >
                {isOpen ? <X size={24} /> : <ListFilter size={24} />}
            </button>

            {/* Sidebar */}
            <section className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-[85vw] sm:w-[320px] lg:w-auto
                bg-white lg:bg-transparent border-1 rounded-lg
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
                h-screen lg:h-auto
            `}>
                {/* Header - Fixed */}
                <div className="flex-none p-4 sm:p-6 border-b bg-white">
                    <div className="flex justify-between items-center">
                        <h3 className="flex gap-2 font-bold text-xl">
                            <ListFilter size={24} /> Filter Products
                        </h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-black transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* Categories */}
                    <div className="flex flex-col gap-3 border-b pb-4">
                        <h4 className="font-semibold text-base bg-stone-100 rounded-lg px-3 py-2">Categories</h4>
                        <ul className="space-y-2 pl-2">
                            {categories.map((category) => (
                                <li key={category} className="flex gap-2 items-center">
                                    <Checkbox
                                        className="border-stone-500"
                                        checked={filters.categories.includes(category)}
                                        onCheckedChange={() => handleFilterChange('categories', category)}
                                    />
                                    <span className="text-sm">{category}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Materials */}
                    <div className="flex flex-col gap-3 border-b pb-4">
                        <h4 className="font-semibold text-base bg-stone-100 rounded-lg px-3 py-2">Material</h4>
                        <ul className="space-y-2 pl-2">
                            {materials.map((material) => (
                                <li key={material} className="flex gap-2 items-center">
                                    <Checkbox
                                        className="border-stone-500"
                                        checked={filters.materials.includes(material)}
                                        onCheckedChange={() => handleFilterChange('materials', material)}
                                    />
                                    <span className="text-sm">{material}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* usages */}
                    <div className="flex flex-col gap-3 border-b pb-4">
                        <h4 className="font-semibold text-base bg-stone-100 rounded-lg px-3 py-2">Application</h4>
                        <div className="space-y-2 pl-2">
                            {usages.map((app) => (
                                <div key={app} className="flex gap-2 items-center">
                                    <Checkbox
                                        className="border-stone-500"
                                        checked={filters.usages.includes(app)}
                                        onCheckedChange={() => handleFilterChange('usages', app)}
                                    />
                                    <span className="text-sm">{app}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="flex flex-col gap-3 border-b pb-4">
                        <h4 className="font-semibold text-base bg-stone-100 rounded-lg px-3 py-2">Color</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pl-2">
                            {colors.map((color) => (
                                <div key={color.value} className="flex gap-2 items-center">
                                    <Checkbox
                                        className={`${color.bgColor} rounded-full size-5`}
                                        checked={filters.colors.includes(color.value)}
                                        onCheckedChange={() => handleFilterChange('colors', color.value)}
                                    />
                                    <span className="text-sm">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}