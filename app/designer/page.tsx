"use client"

import React, { useState, useEffect } from 'react';
import { Upload, Bookmark, Image as ImageIcon, Download, CheckCircle, XCircle, MapPin } from 'lucide-react';

export default function DesignerPage() {
    const [uploadedImg, setUploadedImg] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [tiles, setTiles] = useState<any[]>([]);
    const [selectedTile, setSelectedTile] = useState<any | null>(null);
    const [maskMode, setMaskMode] = useState(false);
    const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [resultImg, setResultImg] = useState<string | null>(null);

    // Lấy bookmark từ localStorage khi load trang
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("bookmarks");
            if (stored) {
                try {
                    const arr = JSON.parse(stored);
                    setTiles(
                        arr.map((item: any) => ({
                            id: item.productId,
                            name: item.productDetails?.Name || "No name",
                            image: Array.isArray(item.productDetails?.Images)
                                ? item.productDetails.Images[0]
                                : item.productDetails?.Images || "/default-tile.jpg",
                        }))
                    );
                } catch {
                    setTiles([]);
                }
            }
        }
    }, []);

    // Upload ảnh
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const dataUrl = ev.target?.result as string;
                // Resize nếu cần (giữ nguyên logic resize nếu có)
                setUploadedImg(dataUrl);
                setUploadedFile(file);
                // Reset các state liên quan
                setSelectedTile(null);
                setPoint(null);
                setResultImg(null);
                // Nếu muốn refresh toàn bộ page:
                // window.location.reload();
            };
            reader.readAsDataURL(file);
        }
    };

    // Lấy x, y khi click ảnh (nếu đang ở mask mode)
    const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (!maskMode) return;
        const rect = (e.target as HTMLImageElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPoint({ x, y });
    };

    // Gửi API với form-data
    const handleSubmit = async () => {
        if (!uploadedFile || !selectedTile || !point) return;
        setLoading(true);
        setResultImg(null);
        let tileFile: File | null = null;
        if (selectedTile.image.startsWith('http') || selectedTile.image.startsWith('/')) {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(selectedTile.image)}`;
            const res = await fetch(proxyUrl);
            const blob = await res.blob();
            tileFile = new File([blob], 'tile01.webp', { type: blob.type });
        }
        const formData = new FormData();
        formData.append('original', uploadedFile);
        if (tileFile) formData.append('tile', tileFile);
        formData.append('point_x', String(Math.round(point.x)));
        formData.append('point_y', String(Math.round(point.y)));
        try {
            const res = await fetch('/api/replace-tile', {
                method: 'POST',
                body: formData,
            });
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.startsWith('image/')) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setResultImg(url);
            } else {
                const data = await res.json();
                setResultImg(data.resultImage);
            }
        } catch (err) {
            alert('Có lỗi khi gửi API');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-auto md:h-[90vh] bg-gray-100">
            {/* Sidebar */}
            <div className="w-full md:max-w-sm bg-white border-r p-3 md:p-6 flex flex-col gap-4 md:gap-6 shadow-sm">
                {/* Header sidebar */}
                <div className="mb-5">
                    <div className="font-bold text-lg md:text-xl tracking-wide pb-2 border-b border-gray-300">Tool-Box</div>
                    <div className="flex items-center pt-4 md:pt-6 justify-start gap-2 md:gap-4 flex-nowrap">
                        <button
                            className="flex justify-center items-center gap-1 px-3 py-2 md:px-5 md:py-3 min-w-[100px] md:min-w-[140px] rounded-lg text-xs md:text-sm font-medium bg-stone-400 text-white border border-transparent hover:bg-stone-500 transition-colors"
                            onClick={() => document.getElementById('uploadInput')?.click()}
                        >
                            <Upload size={16} className="md:w-5 md:h-5" />
                            Upload Image
                        </button>
                        <button
                            className={`flex justify-center items-center gap-1 px-3 py-2 md:px-5 md:py-3 min-w-[100px] md:min-w-[140px] rounded-lg text-xs md:text-sm font-medium bg-white border-2 border-gray-300 text-gray-700 hover:bg-stone-100 hover:text-primary transition-colors ${maskMode ? 'border-primary text-primary' : ''}`}
                            onClick={() => setMaskMode((m) => !m)}
                        >
                            <MapPin size={16} className="md:w-5 md:h-5" />
                            Add Mask
                        </button>
                    </div>
                    <input
                        id="uploadInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </div>

                <div className="space-y-2">
                    <div className="font-semibold text-base flex items-center gap-2 text-gray-800">
                        <Bookmark size={18} />
                        Choose tile from bookmark
                    </div>
                    <div className="overflow-y-auto flex flex-col gap-2 h-56 border rounded-lg p-2 bg-gray-50">
                        {tiles.length === 0 && (
                            <div className="text-gray-400 flex items-center justify-center h-full gap-2 text-sm">
                                <XCircle size={16} />
                                No bookmark found
                            </div>
                        )}
                        {tiles.map((tile) => (
                            <div
                                key={tile.id}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all ${selectedTile?.id === tile.id
                                    ? "border-primary bg-primary/10"
                                    : "border-gray-200 hover:border-primary/40"
                                    }`}
                                onClick={() => setSelectedTile(tile)}
                            >
                                <img src={tile.image} alt={tile.name} className="w-10 h-10 rounded-lg object-cover" />
                                <span className="truncate max-w-[140px] text-sm">{tile.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        className="w-full px-3 py-2.5 bg-stone-600 text-white rounded-lg text-md font-medium shadow hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={!uploadedFile || !selectedTile || !point || loading}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <ImageIcon size={20} />
                                Submit
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-2 space-y-2 text-xs text-gray-600 bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <ImageIcon size={14} />
                        <span>Uploaded image:</span>
                        <span className="flex items-center">
                            {uploadedImg ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bookmark size={14} />
                        <span>Selected tile:</span>
                        <span className="flex-1 truncate">{selectedTile ? selectedTile.name : "None"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>Mask point:</span>
                        <span className="flex-1 truncate">{point ? `x: ${Math.round(point.x)}, y: ${Math.round(point.y)}` : "None"}</span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-2 py-4 md:px-8 md:py-12">
                {(!resultImg && uploadedImg) && (
                    <div className="relative mb-8">
                        <img
                            src={uploadedImg}
                            alt="Uploaded"
                            className="w-full max-w-[95vw] md:max-w-[800px] h-auto object-contain border shadow-xl rounded-xl"
                            onClick={handleImageClick}
                            style={{ cursor: maskMode ? "crosshair" : "default" }}
                        />
                        {point && (
                            <div
                                className="absolute w-7 h-7 rounded-full border-2 border-primary bg-white flex items-center justify-center text-sm font-bold text-primary shadow-lg"
                                style={{
                                    left: point.x - 14,
                                    top: point.y - 14,
                                    pointerEvents: "none",
                                }}
                                title={`(${Math.round(point.x)}, ${Math.round(point.y)})`}
                            >
                                +
                            </div>
                        )}
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
                                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-primary"></div>
                                <span className="ml-4 text-primary font-medium text-base">Processing...</span>
                            </div>
                        )}
                    </div>
                )}
                {!uploadedImg && !resultImg && (
                    <div className="text-gray-400 text-xs md:text-base flex items-center gap-3">
                        <Upload size={20} />
                        Please upload an image to start designing, size: 1100px x 800px
                    </div>
                )}
                {resultImg && (
                    <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 mt-4 w-full max-w-[600px] mx-auto">
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="font-semibold text-sm md:text-lg text-gray-800 text-left break-words">{selectedTile.name}</div>
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs md:text-sm font-medium shadow"
                                onClick={() => {
                                    const a = document.createElement('a');
                                    const safeName = (selectedTile?.name || 'result')
                                        .replace(/[^a-zA-Z0-9-_ ]/g, '')
                                        .replace(/ /g, '_');
                                    a.href = resultImg;
                                    a.download = `${safeName}.png`;
                                    a.click();
                                }}
                            >
                                <Download size={18} />
                                <span className="hidden md:inline">Download</span>
                            </button>
                        </div>
                        <img
                            src={resultImg}
                            alt="Result"
                            className="w-full max-w-[95vw] md:max-w-full object-contain border rounded-xl shadow-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
} 