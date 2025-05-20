'use client';

import { ListFilter, X } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
    "All products",
    "Vinyl Planks",
    "Wall tiles",
    "Floor tiles",
    "Pool tiles",
    "Subway tiles",
    "Mosaic tiles",
    "Pavers",
    "Slabs"
];

const materials = [
    "Ceramic",
    "Glass",
    "Granite",
    "Limestone",
    "Marble",
    "Natural Stone",
    "Porcelain"
];

const applications = [
    "Outdoor Wall",
    "Outdoor Floor",
    "Indoor Wall",
    "Indoor Floor",
    "Shower Wall",
    "Shower Floor",
    "Heated Floor",
    "Commercial Floor",
    "Steam Room",
    "Swimming Pool"
];

const colors = [
    { name: "Beige", value: "beige", bgColor: "bg-amber-100" },
    { name: "Black", value: "black", bgColor: "bg-black" },
    { name: "Blue", value: "blue", bgColor: "bg-blue-400" },
    { name: "Brown", value: "brown", bgColor: "bg-amber-900" },
    { name: "Green", value: "green", bgColor: "bg-lime-500" },
    { name: "Grey", value: "grey", bgColor: "bg-gray-400" }
];

interface Filters {
    categories: string[];
    materials: string[];
    applications: string[];
    colors: string[];
}

export default function Sidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        categories: searchParams.get('categories')?.split(',') || [],
        materials: searchParams.get('materials')?.split(',') || [],
        applications: searchParams.get('applications')?.split(',') || [],
        colors: searchParams.get('colors')?.split(',') || []
    });

    // Cập nhật URL khi filters thay đổi
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.categories.length) params.set('categories', filters.categories.join(','));
        if (filters.materials.length) params.set('materials', filters.materials.join(','));
        if (filters.applications.length) params.set('applications', filters.applications.join(','));
        if (filters.colors.length) params.set('colors', filters.colors.join(','));

        const newUrl = params.toString() ? `?${params.toString()}` : '';
        router.push(newUrl, { scroll: false });
    }, [filters, router]);

    const handleFilterChange = (type: keyof Filters, value: string) => {
        setFilters(prev => {
            const currentValues = prev[type];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            // Nếu chọn "All products", bỏ chọn các danh mục khác
            if (type === 'categories' && value === 'All products') {
                return {
                    ...prev,
                    categories: ['All products']
                };
            }

            // Nếu chọn danh mục khác, bỏ chọn "All products"
            if (type === 'categories' && value !== 'All products') {
                return {
                    ...prev,
                    categories: newValues.filter(v => v !== 'All products')
                };
            }

            return {
                ...prev,
                [type]: newValues
            };
        });
    };

    const clearFilters = () => {
        setFilters({
            categories: [],
            materials: [],
            applications: [],
            colors: []
        });
        router.push('', { scroll: false });
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden fixed bottom-6 left-6 z-50 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors ${isOpen ? 'hidden' : 'block'}`}
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
                                className="text-sm text-black hover:text-sky-500 transition-colors"
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
                                        className="border-sky-950"
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
                                        className="border-sky-950"
                                        checked={filters.materials.includes(material)}
                                        onCheckedChange={() => handleFilterChange('materials', material)}
                                    />
                                    <span className="text-sm">{material}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Applications */}
                    <div className="flex flex-col gap-3 border-b pb-4">
                        <h4 className="font-semibold text-base bg-stone-100 rounded-lg px-3 py-2">Application</h4>
                        <div className="space-y-2 pl-2">
                            {applications.map((app) => (
                                <div key={app} className="flex gap-2 items-center">
                                    <Checkbox
                                        className="border-sky-950"
                                        checked={filters.applications.includes(app)}
                                        onCheckedChange={() => handleFilterChange('applications', app)}
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