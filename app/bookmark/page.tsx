"use client";
import React, { useState, useEffect } from "react";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import { Product } from "@/app/types/product";
import CardProduct from "@/app/components/Homepage/card-product";
import ListProduct from "@/app/components/Homepage/list-product";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Trash } from "lucide-react";
// @ts-ignore
import jsPDF from "jspdf";

// Bảng màu rút gọn cho primary, secondary, accent
const primaryColors = [
    { name: 'Blue 500', value: '#3B82F6' },
    { name: 'Slate 600', value: '#475569' },
    { name: 'Red 500', value: '#EF4444' },
    { name: 'Green 500', value: '#22C55E' },
    { name: 'Amber 500', value: '#F59E0B' },
    { name: 'Purple 500', value: '#8B5CF6' },
    { name: 'Pink 500', value: '#EC4899' },
];
const secondaryColors = [
    { name: 'Gray 200', value: '#E5E7EB' },
    { name: 'Slate 200', value: '#E2E8F0' },
    { name: 'Zinc 200', value: '#E4E4E7' },
    { name: 'Neutral 200', value: '#E5E5E5' },
    { name: 'Stone 200', value: '#E7E5E4' },
];
const accentColors = [
    { name: 'Cyan 400', value: '#22D3EE' },
    { name: 'Teal 400', value: '#2DD4BF' },
    { name: 'Rose 400', value: '#FB7185' },
    { name: 'Indigo 400', value: '#818CF8' },
    { name: 'Yellow 400', value: '#FACC15' },
    { name: 'Lime 400', value: '#A3E635' },
];

export default function BookmarkPage() {
    const [activeTab, setActiveTab] = useState("Saved");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [bookmarks, setBookmarks] = useState<Product[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [deleteItem, setDeleteItem] = useState<boolean>(false);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDeleteCollectionModal, setShowDeleteCollectionModal] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40;
    const router = useRouter();
    const [showBrandNameModal, setShowBrandNameModal] = useState(false);
    const [brandName, setBrandName] = useState("");
    const [primaryColor, setPrimaryColor] = useState(primaryColors[0].value);
    const [secondaryColor, setSecondaryColor] = useState(secondaryColors[0].value);
    const [accentColor, setAccentColor] = useState(accentColors[0].value);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const loadBookmarks = () => {
            try {
                const storedBookmarks = localStorage.getItem('bookmarks');
                if (storedBookmarks) {
                    const parsedBookmarks = JSON.parse(storedBookmarks);
                    if (Array.isArray(parsedBookmarks)) {
                        // Normalize data to match Product interface
                        const validBookmarks = parsedBookmarks.map((bookmark: any) => ({
                            productId: Number(bookmark.productId),
                            partnerPrice: Number(bookmark.partnerPrice) || Number(bookmark.myUnitPrice) || 0,
                            productDetails: bookmark.productDetails
                                ? {
                                    ...bookmark.productDetails,
                                    Images: Array.isArray(bookmark.productDetails.Images)
                                        ? bookmark.productDetails.Images
                                        : bookmark.productDetails.Images
                                            ? [bookmark.productDetails.Images]
                                            : bookmark.images
                                                ? [bookmark.images]
                                                : [],
                                }
                                : {
                                    Usage: bookmark.usage || "",
                                    Categories: bookmark.categories || "",
                                    Trim: bookmark.trim || bookmark.texture || "",
                                    Size: bookmark.size || "",
                                    Images: bookmark.images ? (Array.isArray(bookmark.images) ? bookmark.images : [bookmark.images]) : [],
                                    Color: bookmark.color || "",
                                    Material: bookmark.material || "",
                                    unit_price: bookmark.unitPrice || 0,
                                    Name: bookmark.name || "",
                                    "Color Group": bookmark.colorGroup || "",
                                    UOM: bookmark.unitOfMeasurement || "",
                                    "Photo Hover": bookmark.photoHover || "",
                                    "Qty per Box": bookmark.quantityPerBox?.toString() || "",
                                    Collection: bookmark.collection || "",
                                    "Coverage (sqft)": bookmark.coverage?.toString() || "",
                                    "Size Advanced": bookmark.sizeAdvance || "",
                                }
                        })) as Product[];
                        setBookmarks(validBookmarks);
                    } else {
                        setBookmarks([]);
                    }
                }
            } catch (error) {
                console.error('Error loading bookmarks:', error);
            }
        };

        // Only run on client-side
        if (typeof window === 'undefined') return;

        loadBookmarks();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'bookmarks') {
                loadBookmarks();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('bookmarks-updated', loadBookmarks);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('bookmarks-updated', loadBookmarks);
        };
    }, []);

    useEffect(() => {
        // Only run on client-side
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem('collections');
        if (stored) {
            setCollections(JSON.parse(stored));
        }
    }, []);

    const handleSelectProduct = (id: number) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleCreateCollection = () => {
        const selected = bookmarks.filter(p => selectedProducts.includes(p.productId));
        if (!newCollectionName || selected.length === 0) return;
        const newCol = {
            name: newCollectionName,
            products: selected.map(p => ({
                ...p,
                partnerPrice: (p.productDetails.unit_price * 1.3).toFixed(2) || 0
            }))
        };
        const updated = [...collections, newCol];
        setCollections(updated);
        setNewCollectionName("");
        setSelectedProducts([]);
        if (typeof window !== 'undefined') {
            localStorage.setItem('collections', JSON.stringify(updated));
        }
        toast.success('Collection created');
    };

    const handleUpdatePartnerPrice = (colIdx: number, prodIdx: number, value: number) => {
        setCollections(prev => {
            const updated = [...prev];
            updated[colIdx].products[prodIdx].partnerPrice = value;
            localStorage.setItem('collections', JSON.stringify(updated));
            return updated;
        });
    };

    const handleClearAllBookmarks = () => {
        setShowConfirmModal(true);
    };

    const confirmClearAllBookmarks = () => {
        setBookmarks([]);
        localStorage.removeItem('bookmarks');
        toast.success('All bookmarks have been cleared');
        setShowConfirmModal(false);
    };

    const handleDeleteCollection = (colIdx: number) => {
        setCollectionToDelete(colIdx);
        setShowDeleteCollectionModal(true);
    };

    const confirmDeleteCollection = () => {
        if (collectionToDelete !== null) {
            setCollections(prev => {
                const updated = prev.filter((_, idx) => idx !== collectionToDelete);
                localStorage.setItem('collections', JSON.stringify(updated));
                return updated;
            });
            toast.success('Collection deleted');
            setShowDeleteCollectionModal(false);
            setCollectionToDelete(null);
        }
    };

    const handleDeleteProductInCollection = (colIdx: number, prodIdx: number) => {
        setCollections(prev => {
            if (!prev[colIdx] || !prev[colIdx].products[prodIdx]) return prev;

            const updated = [...prev];
            const updatedProducts = [...updated[colIdx].products];
            updatedProducts.splice(prodIdx, 1);

            if (updatedProducts.length === 0) {
                updated.splice(colIdx, 1);
            } else {
                updated[colIdx] = { ...updated[colIdx], products: updatedProducts };
            }

            localStorage.setItem('collections', JSON.stringify(updated));
            return updated;
        });
        toast.success('Product removed from collection');
    };

    const handleGoToDesignPage = () => {
        localStorage.setItem('designCollection', JSON.stringify(collections));
        router.push('/design');
    };

    const handleConfirmBrandName = () => {
        if (brandName.trim()) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('designCollection', JSON.stringify(collections));
                localStorage.setItem('brandName', brandName);
                localStorage.setItem('primaryColor', primaryColor);
                localStorage.setItem('secondaryColor', secondaryColor);
                localStorage.setItem('accentColor', accentColor);
            }
            router.push('/custom');
        }
    };

    // Hàm chuyển ảnh URL sang base64
    const getImageBase64 = async (url: string): Promise<string | null> => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch {
            return null;
        }
    };

    const handleExportPDF = async () => {
        if (!brandName.trim() || collections.length === 0) return;
        setIsDownloading(true);

        const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });

        const leftMargin = 25;
        const tableWidth = 260;
        const colX = {
            image: leftMargin,
            name: leftMargin + 35,
            size: leftMargin + 95,
            material: leftMargin + 130,
            color: leftMargin + 170,
            price: leftMargin + 215
        };
        const colWidth = {
            image: 28,
            name: 55,
            size: 32,
            material: 35,
            color: 40,
            price: 30
        };

        let isFirstPage = true;

        const renderTableHeader = (y: number) => {
            doc.setFillColor(230, 230, 250);
            doc.setTextColor(40, 40, 120);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.rect(leftMargin, y, tableWidth, 12, "F");

            doc.text("Image", colX.image + 2, y + 8);
            doc.text("Name", colX.name + 2, y + 8);
            doc.text("Size", colX.size + 2, y + 8);
            doc.text("Material", colX.material + 2, y + 8);
            doc.text("Color", colX.color + 2, y + 8);
            doc.text("Price", colX.price + colWidth.price - 2, y + 8, { align: 'right' });

            return y + 18;
        };

        for (const col of collections) {
            doc.addPage();
            let y = 22;

            if (isFirstPage) {
                // Tên thương hiệu ở đầu trang đầu tiên
                doc.setFontSize(22);
                doc.setTextColor(30, 30, 100);
                doc.setFont('helvetica', 'bold');
                doc.text(brandName, 148, y, { align: 'center' });
                doc.setFontSize(12);
                doc.text(`${new Date().toLocaleDateString()}`, 148, y + 10, { align: 'center' });
                y += 14;
                isFirstPage = false;
            }

            // Tên bộ sưu tập
            doc.setFontSize(17);
            doc.setTextColor(40, 40, 120);
            doc.setFont('helvetica', 'bold');
            doc.text(`Collection: ${col.name}`, leftMargin, y);
            y += 10;

            y = renderTableHeader(y);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');

            for (const prod of col.products) {
                const rowHeight = 32;

                // Auto add page nếu sắp tràn
                if (y + rowHeight > 200) {
                    doc.addPage();
                    y = 22;
                    y = renderTableHeader(y);
                }

                let imgY = y - 3;

                // Hình ảnh sản phẩm
                if (prod.productDetails.Images && prod.productDetails.Images[0]) {
                    const imgBase64 = await getImageBase64(prod.productDetails.Images[0]);
                    if (imgBase64) {
                        try {
                            doc.addImage(imgBase64, "JPEG", colX.image, imgY, colWidth.image, colWidth.image, undefined, 'FAST');
                        } catch { }
                    }
                }

                // Nội dung văn bản
                const nameLines = doc.splitTextToSize(String(prod.productDetails.Name || ""), colWidth.name);
                doc.text(nameLines, colX.name, y + 7);
                doc.text(String(prod.productDetails.Size || ""), colX.size, y + 7);
                doc.text(String(prod.productDetails.Material || ""), colX.material, y + 7);
                doc.text(String(prod.productDetails["Color Group"] || ""), colX.color, y + 7);
                doc.text(`$${prod.partnerPrice}`, colX.price + colWidth.price - 2, y + 7, { align: 'right' });

                // Kẻ dòng ngăn cách
                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.3);
                doc.line(leftMargin, y + 25, leftMargin + tableWidth, y + 25);

                y += rowHeight;
            }
        }

        doc.deletePage(1); // Xoá trang đầu trắng nếu có
        doc.save(`${brandName}_catalog.pdf`);
        setShowBrandNameModal(false);
        setIsDownloading(false);
    };

    const savedContent = (
        <div className="w-full py-4 sm:py-6">
            {/* Header Actions */}
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg border transition-colors ${viewMode === "grid" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200"}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </button>
                <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg border transition-colors ${viewMode === "list" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200"}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <button
                    onClick={handleClearAllBookmarks}
                    className="ml-auto text-gray-500 hover:text-red-500 transition-colors"
                    disabled={bookmarks.length === 0}
                >
                    Delete All
                </button>
            </div>
            {/* Empty State */}
            {bookmarks.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
                    <p className="text-gray-600 mb-6">Start bookmarking your favorite items</p>
                </div>
            )}
            {/* Bookmarks Grid/List */}
            {bookmarks.length > 0 ? (
                <>
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                        : "space-y-4"
                    }>
                        {bookmarks
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((product) => (
                                <div key={product.productId}>
                                    {viewMode === 'grid' ? (
                                        <CardProduct product={product} />
                                    ) : (
                                        <ListProduct product={product} />
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Pagination */}
                    {bookmarks.length > itemsPerPage && (
                        <div className="mt-8">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="text-sm text-gray-600">
                                    Page {currentPage} of {Math.ceil(bookmarks.length / itemsPerPage)}
                                </div>
                                <nav className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-sm transition-colors ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: Math.ceil(bookmarks.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`rounded-lg px-3 sm:px-4 py-2 text-sm transition-colors ${currentPage === page
                                                ? 'bg-primary text-white hover:bg-primary/90'
                                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(bookmarks.length / itemsPerPage)))}
                                        disabled={currentPage === Math.ceil(bookmarks.length / itemsPerPage)}
                                        className={`rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-sm transition-colors ${currentPage === Math.ceil(bookmarks.length / itemsPerPage)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </>
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
        </div>
    );

    const createdContent = (
        <div className="w-full py-4 sm:py-6 relative">
            {/* Create collection from bookmarks */}
            <div className="mb-8">
                <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input
                        type="text"
                        placeholder="New collection name"
                        value={newCollectionName}
                        onChange={e => setNewCollectionName(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border rounded-lg"
                    />
                    <button
                        onClick={handleCreateCollection}
                        className="w-full sm:w-auto px-4 py-2 bg-stone-500 hover:bg-stone-800 transition-colors text-white rounded-lg"
                        disabled={!newCollectionName || selectedProducts.length === 0}
                    >
                        Create collection
                    </button>
                </div>

                <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-h-[60vh] overflow-y-auto pr-2">
                    {bookmarks.map(product => (
                        <div key={product.productId}
                            onClick={() => handleSelectProduct(product.productId)}
                            className="border rounded-lg p-4 flex flex-row items-center gap-4 hover:bg-gray-50 cursor-pointer transition-all duration-150"
                        >
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.productId)}
                                onClick={e => e.stopPropagation()}
                                onChange={() => handleSelectProduct(product.productId)}
                                className="mt-0"
                            />
                            <div className="flex-1 flex flex-row items-center gap-3">
                                {product.productDetails?.Images && product.productDetails.Images[0] && (
                                    <Image
                                        src={product.productDetails.Images[0]}
                                        alt={product.productDetails?.Name || 'Product'}
                                        width={48}
                                        height={48}
                                        className="rounded object-cover"
                                    />
                                )}
                                <div>
                                    <div className="font-semibold">{product.productDetails?.Name}</div>
                                    <div className="text-xs text-gray-500">{product.productDetails?.Collection}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Show created collections */}
            <div>
                <div className="flex items-center bg-gray-100 p-2 rounded-lg justify-between mb-4">
                    <h2 className="font-bold text-base sm:text-xl">Created collections</h2>
                    <button
                        className="px-4 py-2 bg-stone-500 text-white rounded-lg shadow hover:bg-stone-800 transition-colors text-sm sm:text-base"
                        onClick={() => setShowBrandNameModal(true)}
                        disabled={collections.length === 0}
                    >
                        Export Catalog
                    </button>
                </div>
                {collections.length === 0 && <div className="text-gray-500">No collection yet</div>}
                {collections.map((col, idx) => (
                    <div key={idx} className="mb-6 border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                            <div className="font-semibold w-full sm:w-auto">{col.name}</div>
                            <button
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 sm:rounded-lg sm:bg-gray-200 flex items-center gap-2 px-3 py-1.5 text-xs self-end sm:self-auto"
                                onClick={() => handleDeleteCollection(idx)}
                                title="Delete collection"
                            >
                                <Trash size={20} className="sm:w-4 sm:h-4" />
                                <span>Delete collection</span>
                            </button>
                        </div>
                        <div className="space-y-3">
                            {col.products.map((prod: any, i: number) => (
                                <div key={`${idx}_${prod.productId || i}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-3 flex-1">
                                        {prod.productDetails?.Images && prod.productDetails.Images[0] && (
                                            <Image
                                                src={prod.productDetails.Images[0]}
                                                alt={prod.productDetails?.Name || 'Product'}
                                                width={40}
                                                height={40}
                                                className="rounded object-cover"
                                            />
                                        )}
                                        <span className="flex-1">{prod.productDetails?.Name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <input
                                            type="number"
                                            value={prod.partnerPrice}
                                            min={0}
                                            step={0.01}
                                            className="w-full sm:w-24 px-2 py-1 border rounded"
                                            onChange={e => handleUpdatePartnerPrice(idx, i, Number(e.target.value))}
                                        />
                                        <span className="text-xs text-gray-500">USD</span>
                                        <button
                                            className="p-1 text-xs hover:bg-gray-200 rounded"
                                            onClick={() => handleDeleteProductInCollection(idx, i)}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="bg-white rounded-2xl shadow-sm">
                    <Tabs
                        tabs={["Saved", "Collection"]}
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                    <div className="px-4 sm:px-6">
                        {activeTab === "Saved" ? savedContent : createdContent}
                    </div>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-semibold text-stone-900 mb-4">Confirm Delete</h3>
                        <p className="text-stone-600 mb-6">
                            Are you sure you want to delete all saved bookmarks? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClearAllBookmarks}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Collection Modal */}
            {showDeleteCollectionModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-semibold text-stone-900 mb-4">Delete Collection</h3>
                        <p className="text-stone-600 mb-6">
                            Are you sure you want to delete this collection? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteCollectionModal(false);
                                    setCollectionToDelete(null);
                                }}
                                className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteCollection}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Brand Name Modal */}
            {showBrandNameModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Export Catalog PDF</h3>
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="Enter your brand name"
                            className="w-full px-3 py-2 border rounded-lg mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowBrandNameModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={!brandName.trim()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                            >
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay loading when isDownloading */}
            {isDownloading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-lg px-8 py-6 shadow-lg text-lg font-semibold flex items-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        Exporting file PDF...
                    </div>
                </div>
            )}
        </main>
    );
}
