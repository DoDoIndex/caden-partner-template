"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import {
    Trash2,
    Download,
    Save,
    RefreshCcw
} from 'lucide-react';

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function DesignerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const [houseImg, setHouseImg] = useState<string | null>(null);
    const [tileImgs, setTileImgs] = useState<string[]>([]);
    const [selectedTile, setSelectedTile] = useState<string | null>(null);

    useEffect(() => {
        if (canvasRef.current && !fabricRef.current) {
            fabricRef.current = new fabric.Canvas(canvasRef.current, {
                preserveObjectStacking: true,
                backgroundColor: '#f3f4f6'
            });
        }
        const saved = localStorage.getItem('designer-canvas');
        if (saved && fabricRef.current) {
            fabricRef.current.loadFromJSON(saved, () => {
                fabricRef.current?.renderAll();
            });
        }
        const savedHouse = localStorage.getItem('designer-house');
        if (savedHouse) setHouseImg(savedHouse);
        const savedTiles = localStorage.getItem('designer-tiles');
        if (savedTiles) setTileImgs(JSON.parse(savedTiles));
        return () => {
            fabricRef.current?.dispose();
        };
    }, []);

    useEffect(() => {
        if (houseImg && fabricRef.current) {
            fabric.Image.fromURL(houseImg, ((img: any) => {
                fabricRef.current?.set('backgroundImage', img);
                if (img && fabricRef.current) {
                    img.scaleToWidth(fabricRef.current.width || 700);
                    img.scaleToHeight(fabricRef.current.height || 500);
                }
                fabricRef.current?.renderAll();
            }) as any);
        }
    }, [houseImg]);

    useEffect(() => {
        if (selectedTile && fabricRef.current) {
            fabric.Image.fromURL(selectedTile, ((img: any) => {
                img.set({ left: 100, top: 100, scaleX: 0.3, scaleY: 0.3, cornerColor: 'blue' });
                fabricRef.current?.add(img);
                fabricRef.current?.setActiveObject(img);
            }) as any);
            setSelectedTile(null);
        }
    }, [selectedTile]);

    const handleHouseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setHouseImg(base64);
            localStorage.setItem('designer-house', base64);
        }
    };

    const handleTileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const arr = await Promise.all(Array.from(files).map(fileToBase64));
            setTileImgs(prev => {
                const newImgs = [...prev, ...arr];
                localStorage.setItem('designer-tiles', JSON.stringify(newImgs));
                return newImgs;
            });
        }
    };

    const handleClearTiles = () => {
        if (fabricRef.current) {
            fabricRef.current.getObjects().forEach(obj => {
                if ((obj as any).type === 'image' && obj !== fabricRef.current!.backgroundImage) {
                    fabricRef.current!.remove(obj);
                }
            });
        }
    };

    const handleExport = () => {
        if (fabricRef.current) {
            const dataUrl = fabricRef.current.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'design.png';
            link.click();
        }
    };

    const handleSaveDesign = () => {
        if (fabricRef.current) {
            const json = fabricRef.current.toJSON();
            localStorage.setItem('designer-canvas', JSON.stringify(json));
            alert('Design saved!');
        }
    };

    const handleLoadDesign = () => {
        const saved = localStorage.getItem('designer-canvas');
        if (saved && fabricRef.current) {
            fabricRef.current.loadFromJSON(saved, () => {
                fabricRef.current?.renderAll();
            });
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center py-10">
            <h1 className="text-3xl font-extrabold mb-8 text-amber-600 tracking-wide">UI Designer</h1>
            <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
                <aside className="w-full md:w-72 bg-white border border-stone-200 rounded-2xl shadow p-6 mb-8 md:mb-0 flex flex-col gap-8">
                    <div>
                        <label className="font-semibold block mb-2 text-stone-700">Upload House Image</label>
                        <input type="file" accept="image/*" onChange={handleHouseUpload} className="mb-2 block w-full border border-stone-300 rounded-lg px-2 py-1 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        {houseImg && <img src={houseImg} alt="House" className="w-full rounded-xl border border-stone-200 mt-2" />}
                    </div>
                    <div>
                        <label className="font-semibold block mb-2 text-stone-700">Upload Tile Images</label>
                        <input type="file" accept="image/*" multiple onChange={handleTileUpload} className="mb-2 block w-full border border-stone-300 rounded-lg px-2 py-1 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <div className="flex flex-wrap gap-3 mt-2">
                            {tileImgs.map((img, idx) => (
                                <div key={img + idx} className="relative group">
                                    <img
                                        src={img}
                                        alt="Tile"
                                        className={`w-16 h-16 object-cover rounded-xl border-2 transition cursor-pointer ${selectedTile === img ? 'border-amber-500' : 'border-stone-200'} hover:border-amber-400 shadow-sm`}
                                        onClick={() => setSelectedTile(img)}
                                    />
                                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">Click to add</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                        <button
                            onClick={handleClearTiles}
                            className="px-4 py-2 bg-gray-200 text-black rounded-xl hover:bg-gray-300 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Clear Tiles
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <Download size={16} /> Export PNG
                        </button>
                        <button
                            onClick={handleSaveDesign}
                            className="px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-black font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <Save size={16} /> Save Design
                        </button>
                        <button
                            onClick={handleLoadDesign}
                            className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-xl hover:bg-stone-100 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <RefreshCcw size={16} /> Load Design
                        </button>
                    </div>
                </aside>
                <div className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-center">
                        <canvas ref={canvasRef} width={700} height={500} className="border-2 border-stone-300 rounded-2xl shadow bg-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
