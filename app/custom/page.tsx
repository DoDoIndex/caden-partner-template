'use client';

import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { LayoutGrid, List, Plus, Trash2, Save, Eye, Settings, Palette, Layout, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/app/types/product';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import CustomNavbar from '@/components/custom/CustomNavbar';
import CustomFooter from '@/components/custom/CustomFooter';

interface Section {
    id: string;
    type: 'grid' | 'list';
    title: string;
    products: Product[];
    collectionId?: string;
    style: {
        backgroundColor: string;
        textColor: string;
        padding: string;
        borderRadius: string;
        titleSize: string;
        productCardStyle: {
            backgroundColor: string;
            textColor: string;
            padding: string;
            borderRadius: string;
        };
    };
}

interface Collection {
    id: string;
    name: string;
    products: Product[];
}

const colorOptions = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Light Gray', value: '#F3F4F6' },
    { name: 'Primary', value: '#2563EB' },
    { name: 'Secondary', value: '#4B5563' },
];

const paddingOptions = [
    { name: 'Small', value: 'p-2' },
    { name: 'Medium', value: 'p-4' },
    { name: 'Large', value: 'p-6' },
    { name: 'Extra Large', value: 'p-8' },
];

const borderRadiusOptions = [
    { name: 'None', value: 'rounded-none' },
    { name: 'Small', value: 'rounded' },
    { name: 'Medium', value: 'rounded-lg' },
    { name: 'Large', value: 'rounded-xl' },
    { name: 'Full', value: 'rounded-full' },
];

const titleSizeOptions = [
    { name: 'Small', value: 'text-lg' },
    { name: 'Medium', value: 'text-xl' },
    { name: 'Large', value: 'text-2xl' },
    { name: 'Extra Large', value: 'text-3xl' },
];

export default function CustomPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [bookmarks, setBookmarks] = useState<Product[]>([]);
    const [isPreview, setIsPreview] = useState(false);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [brandName, setBrandName] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#000000');
    const [secondaryColor, setSecondaryColor] = useState('#F3F4F6');
    const [accentColor, setAccentColor] = useState('#2563EB');

    // Luôn load bookmark và collection từ localStorage mỗi lần vào trang
    useEffect(() => {
        const savedCollections = localStorage.getItem('designCollection');
        const savedBookmarks = localStorage.getItem('bookmarks');
        const savedBrandName = localStorage.getItem('brandName');
        const savedPrimaryColor = localStorage.getItem('primaryColor');
        const savedSecondaryColor = localStorage.getItem('secondaryColor');
        const savedAccentColor = localStorage.getItem('accentColor');

        if (savedCollections) setCollections(JSON.parse(savedCollections));
        if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
        if (savedBrandName) setBrandName(savedBrandName);
        if (savedPrimaryColor) setPrimaryColor(savedPrimaryColor);
        if (savedSecondaryColor) setSecondaryColor(savedSecondaryColor);
        if (savedAccentColor) setAccentColor(savedAccentColor);

        // Tự động sinh section nếu chưa có
        if ((!sections || sections.length === 0) && (savedCollections || savedBookmarks)) {
            let autoSections: any[] = [];
            if (savedCollections && JSON.parse(savedCollections).length > 0) {
                autoSections = (JSON.parse(savedCollections) as any[]).map((col: any, idx: number) => ({
                    id: Date.now().toString() + idx,
                    type: 'grid',
                    title: col.name,
                    products: col.products,
                    collectionId: col.id || undefined,
                    style: {
                        backgroundColor: savedSecondaryColor || '#F3F4F6',
                        textColor: savedPrimaryColor || '#000000',
                        padding: 'p-6',
                        borderRadius: 'rounded-lg',
                        titleSize: 'text-xl',
                        productCardStyle: {
                            backgroundColor: '#FFFFFF',
                            textColor: savedPrimaryColor || '#000000',
                            padding: 'p-4',
                            borderRadius: 'rounded-lg',
                        },
                    },
                }));
            } else if (savedBookmarks && JSON.parse(savedBookmarks).length > 0) {
                autoSections = [{
                    id: Date.now().toString(),
                    type: 'grid',
                    title: 'All Bookmarks',
                    products: JSON.parse(savedBookmarks),
                    style: {
                        backgroundColor: savedSecondaryColor || '#F3F4F6',
                        textColor: savedPrimaryColor || '#000000',
                        padding: 'p-6',
                        borderRadius: 'rounded-lg',
                        titleSize: 'text-xl',
                        productCardStyle: {
                            backgroundColor: '#FFFFFF',
                            textColor: savedPrimaryColor || '#000000',
                            padding: 'p-4',
                            borderRadius: 'rounded-lg',
                        },
                    },
                }];
            }
            if (autoSections.length > 0) setSections(autoSections);
        }
    }, []);

    // Lưu sections vào localStorage khi có thay đổi
    useEffect(() => {
        localStorage.setItem('customPageSections', JSON.stringify(sections));
    }, [sections]);

    const addSection = () => {
        const newSection: Section = {
            id: Date.now().toString(),
            type: 'grid',
            title: 'New Section',
            products: [],
            style: {
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
                padding: 'p-6',
                borderRadius: 'rounded-lg',
                titleSize: 'text-xl',
                productCardStyle: {
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                    padding: 'p-4',
                    borderRadius: 'rounded-lg',
                },
            },
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (sectionId: string) => {
        setSections(sections.filter(section => section.id !== sectionId));
    };

    const updateSectionTitle = (sectionId: string, newTitle: string) => {
        setSections(sections.map(section =>
            section.id === sectionId ? { ...section, title: newTitle } : section
        ));
    };

    const toggleSectionType = (sectionId: string) => {
        setSections(sections.map(section =>
            section.id === sectionId ? { ...section, type: section.type === 'grid' ? 'list' : 'grid' } : section
        ));
    };

    const addCollectionToSection = (sectionId: string, collectionId: string) => {
        const collection = collections.find(c => c.id === collectionId);
        if (collection) {
            setSections(sections.map(section =>
                section.id === sectionId ? { ...section, collectionId, products: collection.products } : section
            ));
        }
    };

    const updateSectionStyle = (sectionId: string, styleKey: string, value: string) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? {
                    ...section,
                    style: {
                        ...section.style,
                        [styleKey]: value,
                    },
                }
                : section
        ));
    };

    const updateProductCardStyle = (sectionId: string, styleKey: string, value: string) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? {
                    ...section,
                    style: {
                        ...section.style,
                        productCardStyle: {
                            ...section.style.productCardStyle,
                            [styleKey]: value,
                        },
                    },
                }
                : section
        ));
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSections(items);
    };

    const savePage = () => {
        localStorage.setItem('customPageSections', JSON.stringify(sections));
        alert('Page saved successfully!');
    };

    // Lấy filter động từ dữ liệu sản phẩm
    const allProducts = useMemo(() => sections.flatMap(s => s.products), [sections]);
    const categories = Array.from(new Set(allProducts.map(p => p.productDetails?.Categories).filter(Boolean)));
    const brands = Array.from(new Set(allProducts.map(p => p.productDetails?.Collection).filter(Boolean)));
    const colors = Array.from(new Set(allProducts.map(p => p.productDetails?.["Color Group"]).filter(Boolean)));
    const sizes = Array.from(new Set(allProducts.map(p => p.productDetails?.Size).filter(Boolean)));
    const prices = allProducts.map(p => p.partnerPrice).filter(Boolean);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // State filter
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<[number, number]>([minPrice, maxPrice]);
    const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc'>('popularity');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Lọc sản phẩm
    const filteredProducts = allProducts.filter(p => {
        if (selectedCategory && p.productDetails?.Categories !== selectedCategory) return false;
        if (selectedBrand && p.productDetails?.Collection !== selectedBrand) return false;
        if (selectedColor && p.productDetails?.["Color Group"] !== selectedColor) return false;
        if (selectedSize && p.productDetails?.Size !== selectedSize) return false;
        if (p.partnerPrice < selectedPrice[0] || p.partnerPrice > selectedPrice[1]) return false;
        return true;
    });

    // Sắp xếp
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-asc') return a.partnerPrice - b.partnerPrice;
        if (sortBy === 'price-desc') return b.partnerPrice - a.partnerPrice;
        return 0;
    });

    // Phân trang
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <CustomNavbar brandName={brandName} />
            <div className="flex-1">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-2 sm:px-4">
                    {/* Sidebar filter */}
                    <aside className="w-full lg:w-64 bg-white rounded-2xl shadow p-6 h-fit sticky top-8 self-start mb-6 lg:mb-0 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2"><span>��</span>Filter</h2>
                            <button
                                className="text-xs text-primary hover:underline px-2 py-1 rounded hover:bg-primary/10"
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedBrand(null);
                                    setSelectedColor(null);
                                    setSelectedSize(null);
                                    setSelectedPrice([minPrice, maxPrice]);
                                }}
                            >
                                Clear all
                            </button>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><span>📂</span>Category</h3>
                            <ul className="space-y-1">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <button className={`w-full text-left px-2 py-1 rounded transition border ${selectedCategory === cat ? 'bg-primary text-white font-semibold border-primary' : 'hover:bg-gray-100 border-transparent'}`} onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}>{cat}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><span>🏷️</span>Brand</h3>
                            <ul className="space-y-1">
                                {brands.map(brand => (
                                    <li key={brand}>
                                        <button className={`w-full text-left px-2 py-1 rounded transition border ${selectedBrand === brand ? 'bg-primary text-white font-semibold border-primary' : 'hover:bg-gray-100 border-transparent'}`} onClick={() => setSelectedBrand(brand === selectedBrand ? null : brand)}>{brand}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><span>🎨</span>Color</h3>
                            <ul className="space-y-1">
                                {colors.map(color => (
                                    <li key={color}>
                                        <button className={`w-full text-left px-2 py-1 rounded transition border ${selectedColor === color ? 'bg-primary text-white font-semibold border-primary' : 'hover:bg-gray-100 border-transparent'}`} onClick={() => setSelectedColor(color === selectedColor ? null : color)}>{color}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><span>📏</span>Size</h3>
                            <ul className="space-y-1">
                                {sizes.map(size => (
                                    <li key={size}>
                                        <button className={`w-full text-left px-2 py-1 rounded transition border ${selectedSize === size ? 'bg-primary text-white font-semibold border-primary' : 'hover:bg-gray-100 border-transparent'}`} onClick={() => setSelectedSize(size === selectedSize ? null : size)}>{size}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><span>💲</span>Price</h3>
                            <div className="flex items-center gap-2">
                                <input type="number" className="w-16 border rounded px-2 py-1" value={selectedPrice[0]} min={minPrice} max={selectedPrice[1]} onChange={e => setSelectedPrice([Number(e.target.value), selectedPrice[1]])} />
                                <span>-</span>
                                <input type="number" className="w-16 border rounded px-2 py-1" value={selectedPrice[1]} min={selectedPrice[0]} max={maxPrice} onChange={e => setSelectedPrice([selectedPrice[0], Number(e.target.value)])} />
                            </div>
                        </div>
                    </aside>
                    {/* Main content */}
                    <main className="flex-1">
                        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">{brandName}</h1>
                        {/* Breadcrumb + filter bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                            <div className="text-gray-500 text-sm mb-2 sm:mb-0">Showing {paginatedProducts.length} of {filteredProducts.length} results</div>
                            <div className="flex gap-2 items-center">
                                <span className="text-sm">Sort by:</span>
                                <select className="border rounded px-2 py-1" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                                    <option value="popularity">Popularity</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                        {/* Filter tags */}
                        <div className="mb-4 flex flex-wrap gap-2">
                            {selectedCategory && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">{selectedCategory} <button onClick={() => setSelectedCategory(null)} className="ml-1">×</button></span>}
                            {selectedBrand && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">{selectedBrand} <button onClick={() => setSelectedBrand(null)} className="ml-1">×</button></span>}
                            {selectedColor && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">{selectedColor} <button onClick={() => setSelectedColor(null)} className="ml-1">×</button></span>}
                            {selectedSize && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">{selectedSize} <button onClick={() => setSelectedSize(null)} className="ml-1">×</button></span>}
                            {(selectedPrice[0] !== minPrice || selectedPrice[1] !== maxPrice) && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">${selectedPrice[0]} - ${selectedPrice[1]} <button onClick={() => setSelectedPrice([minPrice, maxPrice])} className="ml-1">×</button></span>}
                        </div>
                        {/* Product grid */}
                        {paginatedProducts.length === 0 ? (
                            <div className="text-center text-gray-400 py-16 text-lg">No products found.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedProducts.map(product => (
                                    <div key={product.productId} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col transition hover:shadow-2xl">
                                        <img src={product.productDetails?.["Photo Hover"] || (product.productDetails?.Images?.split ? product.productDetails.Images.split('\n')[0] : product.productDetails?.Images?.[0])} alt={product.productDetails?.Name} className="w-full h-56 object-cover rounded-xl mb-4" />
                                        <div className="flex-1 flex flex-col">
                                            <div className="font-semibold mb-1 text-base">{product.productDetails?.Name}</div>
                                            <div className="text-gray-500 text-xs mb-1">{product.productDetails?.["Color Group"] ? product.productDetails["Color Group"].split(',').length + ' Colors' : ''}</div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-lg text-primary">${product.partnerPrice}</span>
                                                {product.productDetails?.unit_price && product.productDetails.unit_price > product.partnerPrice && (
                                                    <span className="text-gray-400 line-through text-sm">${product.productDetails.unit_price}</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400">{product.productDetails?.Collection}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Previous</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-primary text-white' : 'bg-white'}`}>{page}</button>
                                ))}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Next</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <CustomFooter brandName={brandName} />
        </div>
    );
} 