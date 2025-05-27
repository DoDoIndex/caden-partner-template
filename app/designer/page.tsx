"use client"

import React, { useState, useEffect } from 'react';

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
            setUploadedFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setUploadedImg(ev.target?.result as string);
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
            const res = await fetch(selectedTile.image);
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
        <div className="flex h-[90vh] bg-gray-100">
            {/* Sidebar */}
            <div className="w-full max-w-xs bg-white border-r p-6 flex flex-col gap-6 shadow-sm">
                <button
                    className="w-full px-4 py-2 bg-primary text-white rounded mb-2 shadow hover:bg-primary/90 transition-colors"
                    onClick={() => document.getElementById("uploadInput")?.click()}
                >
                    Upload Image
                </button>
                <input
                    id="uploadInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />

                <div>
                    <div className="font-semibold mb-2">Choose tile from bookmark:</div>
                    <div className="overflow-y-auto flex flex-col gap-2 h-40 border rounded p-2 bg-gray-50">
                        {tiles.length === 0 && <div className="text-gray-400">No bookmark found</div>}
                        {tiles.map((tile) => (
                            <div
                                key={tile.id}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${selectedTile?.id === tile.id ? "border-primary bg-primary/10" : "border-gray-200 hover:border-primary/40"
                                    }`}
                                onClick={() => setSelectedTile(tile)}
                            >
                                <img src={tile.image} alt={tile.name} className="w-10 h-10 rounded object-cover" />
                                <span className="truncate max-w-[100px]">{tile.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className={`w-full px-4 py-2 rounded mt-2 font-semibold transition-colors ${maskMode ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-primary/10"}`}
                    onClick={() => setMaskMode((m) => !m)}
                >
                    {maskMode ? "Selecting point (Add Mask)" : "Add Mask"}
                </button>

                <button
                    className="w-full px-4 py-2 bg-green-600 text-white rounded mt-2 font-semibold shadow hover:bg-green-700 transition-colors"
                    onClick={handleSubmit}
                    disabled={!uploadedFile || !selectedTile || !point || loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

                <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <div>Uploaded image: {uploadedImg ? "✔️" : "None"}</div>
                    <div>Selected tile: {selectedTile ? selectedTile.name : "None"}</div>
                    <div>
                        Mask point: {point ? `x: ${Math.round(point.x)}, y: ${Math.round(point.y)}` : "None"}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-10">
                {(!resultImg && uploadedImg) && (
                    <div className="relative mb-8">
                        <img
                            src={uploadedImg}
                            alt="Uploaded"
                            className="max-w-[700px] max-h-[70vh] border shadow-lg rounded-lg"
                            onClick={handleImageClick}
                            style={{ cursor: maskMode ? "crosshair" : "default" }}
                        />
                        {point && (
                            <div
                                className="absolute w-6 h-6 rounded-full border-2 border-primary bg-white flex items-center justify-center text-xs font-bold text-primary shadow"
                                style={{
                                    left: point.x - 12,
                                    top: point.y - 12,
                                    pointerEvents: "none",
                                }}
                                title={`(${Math.round(point.x)}, ${Math.round(point.y)})`}
                            >
                                +
                            </div>
                        )}
                        {loading && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
                                <span className="ml-4 text-primary font-semibold">Processing...</span>
                            </div>
                        )}
                    </div>
                )}
                {!uploadedImg && !resultImg && <div className="text-gray-400 text-lg">Please upload an image to start designing</div>}
                {resultImg && (
                    <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 mt-4 max-w-full">
                        <div className="font-semibold text-lg mb-1">Result</div>
                        <img src={resultImg} alt="Result" className="max-w-[500px] w-full border rounded-lg shadow mb-2" />
                        <button
                            className="w-full max-w-[300px] px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-base font-semibold shadow"
                            onClick={() => {
                                const a = document.createElement('a');
                                a.href = resultImg;
                                a.download = 'result.png';
                                a.click();
                            }}
                        >
                            Download Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 