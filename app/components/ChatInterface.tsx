"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Loader2, Bookmark, BookmarkCheck, Eye } from 'lucide-react';
import ReactModal from 'react-modal';
import { handleChatActions, showCollection } from './Homepage/chat-actions';

// Mock data for testing when API is not available
const MOCK_PRODUCTS = [
    {
        "productId": 3428,
        "productDetails": {
            "Usage": "Commercial Floors\nHeated Floors\nIndoor Floors\nIndoor Walls\nOutdoor Walls\nShower Walls\nSteam Rooms\nSwimming Pools",
            "Trim": "Field Tile",
            "Size": "35x35 Field",
            "Color": "Ivory Matt Polished",
            "Material": "Porcelain",
            "unit_price": 13.08,
            "Name": "Ares Ivory Matt Polished 35x35 Field",
            "Color Group": "Beige\nWhite",
            "Collection": "Ares",
            "Coverage (sqft)": "8.72",
            "Size Advanced": "35.4\"x35.4\" | Thickness: 9 mm",
            "Photo Hover": "https://cdn.swell.store/caden-tile/682b51056b13380013175fc4/5c75c1491f08a50134c509845844f82c/Ares-Ivory-Matt-Polished-35x35-02.webp"
        }
    }
];

interface Product {
    productId: number;
    productDetails: {
        Usage: string;
        Categories: string;
        Trim: string;
        Size: string;
        Images: string | string[];
        Color: string;
        Material: string;
        unit_price: number;
        Name: string;
        "Color Group": string;
        UOM: string;
        "Photo Hover": string;
        "Qty per Box": string;
        Collection: string;
        "Coverage (sqft)": string;
        "Size Advanced": string;
    };
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    products?: Product[];
}

interface Bookmark extends Product {
    bookmarkedAt: number;
}

interface Collection {
    id: string;
    name: string;
    products: Bookmark[];
    createdAt: number;
    updatedAt: number;
}

interface ChatResponse {
    message: string;
    products: Product[];
    action: string;
    error?: boolean;
    askCollection?: boolean;
    collectionPrompt?: string;
    collectionName?: string;
    productName?: string;
    showCollections?: boolean;
    showBookmarks?: boolean;
}

// Update the normalizeProduct function
const normalizeProduct = (product: any): Product => {
    // Ensure all required fields are present with default values
    const normalizedProduct: Product = {
        productId: product.productId || 0,
        productDetails: {
            Usage: product.productDetails?.Usage || '',
            Categories: product.productDetails?.Categories || '',
            Trim: product.productDetails?.Trim || '',
            Size: product.productDetails?.Size || '',
            Images: product.productDetails?.Image || product.productDetails?.Images || product.productDetails?.['Photo Hover'] || '',
            Color: product.productDetails?.Color || '',
            Material: product.productDetails?.Material || '',
            unit_price: product.productDetails?.unit_price || 0,
            Name: product.productDetails?.Name || '',
            "Color Group": product.productDetails?.["Color Group"] || '',
            UOM: product.productDetails?.UOM || '',
            "Photo Hover": product.productDetails?.["Photo Hover"] || '',
            "Qty per Box": product.productDetails?.["Qty per Box"] || '',
            Collection: product.productDetails?.Collection || '',
            "Coverage (sqft)": product.productDetails?.["Coverage (sqft)"] || '',
            "Size Advanced": product.productDetails?.["Size Advanced"] || ''
        }
    };

    // Convert Images to array if it's a string
    if (typeof normalizedProduct.productDetails.Images === 'string') {
        normalizedProduct.productDetails.Images = normalizedProduct.productDetails.Images.split('\n').filter(Boolean);
    }

    return normalizedProduct;
};

export default function ChatInterface() {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant' as const,
            content: "I can help you find tiles based on Material, Color Group, Size, Usage, or Trim. Please specify what you're looking for. For example: 'Show me porcelain tiles' or 'Find tiles for indoor walls'",
            timestamp: Date.now()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastBookmarkedProducts, setLastBookmarkedProducts] = useState<Product[]>([]);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [modalCollection, setModalCollection] = useState<Collection | null>(null);

    const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const getBookmarks = (): Bookmark[] => {
        try {
            const bookmarksStr = localStorage.getItem('bookmarks');
            return bookmarksStr ? JSON.parse(bookmarksStr) : [];
        } catch (error) {
            console.error('Error getting bookmarks:', error);
            return [];
        }
    };

    const saveBookmarks = (bookmarks: Bookmark[]): void => {
        try {
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            window.dispatchEvent(new Event('bookmarks-updated'));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
            throw error;
        }
    };

    const getCollections = (): Collection[] => {
        try {
            const collectionsStr = localStorage.getItem('collections');
            return collectionsStr ? JSON.parse(collectionsStr) : [];
        } catch (error) {
            console.error('Error getting collections:', error);
            return [];
        }
    };

    const saveCollections = (collections: Collection[]): void => {
        try {
            localStorage.setItem('collections', JSON.stringify(collections));
            window.dispatchEvent(new Event('collections-updated'));
        } catch (error) {
            console.error('Error saving collections:', error);
            throw error;
        }
    };

    const addToBookmarks = (products: Product[]): Bookmark[] => {
        const existingBookmarks = getBookmarks();
        const newBookmarks: Bookmark[] = [];

        products.forEach(product => {
            if (!existingBookmarks.some(b => b.productId === product.productId)) {
                const normalizedProduct = normalizeProduct(product);
                newBookmarks.push({
                    ...normalizedProduct,
                    bookmarkedAt: Date.now()
                });
            }
        });

        if (newBookmarks.length > 0) {
            const updatedBookmarks = [...existingBookmarks, ...newBookmarks];
            saveBookmarks(updatedBookmarks);
        }

        return newBookmarks;
    };

    const addToCollection = (products: Product[], collectionName: string, isNew: boolean = false): boolean => {
        try {
            const collections = getCollections();
            const now = Date.now();

            if (isNew) {
                // Create new collection
                const newCollection: Collection = {
                    id: `collection_${now}`,
                    name: collectionName,
                    products: products.map(p => ({ ...normalizeProduct(p), bookmarkedAt: now })),
                    createdAt: now,
                    updatedAt: now
                };
                collections.push(newCollection);
            } else {
                // Add to existing collection
                const existingCollection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());
                if (existingCollection) {
                    const newProducts = products.filter(product =>
                        !existingCollection.products.some(p => p.productId === product.productId)
                    );
                    existingCollection.products.push(...newProducts.map(p => ({ ...normalizeProduct(p), bookmarkedAt: now })));
                    existingCollection.updatedAt = now;
                } else {
                    return false;
                }
            }

            saveCollections(collections);
            return true;
        } catch (error) {
            console.error('Error adding to collection:', error);
            return false;
        }
    };

    const formatCollectionMessage = (collections: Collection[]): string => {
        if (collections.length === 0) {
            return "You don't have any collections yet. You can create one by bookmarking tiles and adding them to a collection.";
        }
        // We'll return a placeholder, actual rendering will be handled below
        return '__SHOW_COLLECTIONS__';
    };

    const formatBookmarksMessage = (bookmarks: Bookmark[]): string => {
        if (bookmarks.length === 0) {
            return "You don't have any bookmarks yet. Start bookmarking your favorite tiles!";
        }
        // We'll return a placeholder, actual rendering will be handled below
        return '__SHOW_BOOKMARKS__';
    };

    // Helper to store and retrieve latest found tiles
    const getLatestFoundTiles = (): Product[] => {
        try {
            const tilesStr = localStorage.getItem('latest_found_tiles');
            return tilesStr ? JSON.parse(tilesStr) : [];
        } catch (error) {
            console.error('Error getting latest found tiles:', error);
            return [];
        }
    };
    const setLatestFoundTiles = (tiles: Product[]): void => {
        try {
            // Map each tile to set Images = Image if Image exists
            const mappedTiles = tiles.map(tile => {
                const image = (tile.productDetails as any)?.Images || '';
                return {
                    ...tile,
                    productDetails: {
                        ...tile.productDetails,
                        Images: image
                    }
                };
            });
            localStorage.setItem('latest_found_tiles', JSON.stringify(mappedTiles));
        } catch (error) {
            console.error('Error setting latest found tiles:', error);
        }
    };

    // Handle sending a message to the chat
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: inputMessage,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMessage]);
        setTimeout(scrollToBottom, 100);

        // Check for collection viewing request
        const showCollectionMatch = inputMessage.match(/show\s+collection\s+(?:named\s+)?['"]?([^'"]+)['"]?/i);
        if (showCollectionMatch) {
            const collectionName = showCollectionMatch[1].trim();
            const collections = getCollections();
            const foundCollection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());
            let assistantMessage: ChatMessage;
            if (foundCollection) {
                assistantMessage = {
                    id: generateId(),
                    role: 'assistant',
                    content: `Collection: ${foundCollection.name}`,
                    timestamp: Date.now(),
                    products: foundCollection.products
                };
            } else {
                assistantMessage = {
                    id: generateId(),
                    role: 'assistant',
                    content: `Collection '${collectionName}' does not exist.`,
                    timestamp: Date.now()
                };
            }
            setMessages(prev => [...prev, assistantMessage]);
            setInputMessage('');
            return;
        }

        // Check for general collection viewing request
        if (inputMessage.toLowerCase().match(/show|list|view|see|display.*collection/i)) {
            const collections = getCollections();
            const collectionMessage = formatCollectionMessage(collections);
            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: collectionMessage,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setInputMessage('');
            return;
        }

        // Check for bookmarks viewing request
        if (inputMessage.toLowerCase().match(/show|list|view|see|display.*bookmark/i)) {
            const bookmarks = getBookmarks();
            const bookmarksMessage = formatBookmarksMessage(bookmarks);
            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: bookmarksMessage,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setInputMessage('');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage }),
            });

            if (!response.ok) {
                throw new Error('API response was not ok');
            }

            const data: ChatResponse = await response.json();

            if (data.error) {
                const errorMessage: ChatMessage = {
                    id: generateId(),
                    role: 'assistant',
                    content: data.message,
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, errorMessage]);
                toast.error(data.message);
                setIsLoading(false);
                setInputMessage('');
                return;
            }

            // Handle localStorage operations based on the action
            handleChatActions(data);

            // Handle show collections action from backend
            if (data.showCollections) {
                const collections = getCollections();
                const collectionMessage = formatCollectionMessage(collections);
                data.message = collectionMessage;
            }

            // Handle show bookmarks action from backend
            if (data.showBookmarks) {
                const bookmarks = getBookmarks();
                const bookmarksMessage = formatBookmarksMessage(bookmarks);
                data.message = bookmarksMessage;
            }

            let productsForMessage: Product[] | undefined = undefined;
            if ([
                'search',
                'search_and_bookmark',
                'search_bookmark_collection'
            ].includes(data.action) && data.products && data.products.length > 0) {
                productsForMessage = data.products.map(normalizeProduct);
            } else if (data.action === 'show_bookmark') {
                const bookmarks = getBookmarks();
                if (bookmarks.length > 0) {
                    productsForMessage = bookmarks;
                }
            }
            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: data.message,
                timestamp: Date.now(),
                products: productsForMessage
            };
            setMessages(prev => [...prev, assistantMessage]);

            // Handle different actions
            switch (data.action) {
                case 'search':
                    if (data.products && data.products.length > 0) {
                        setLatestFoundTiles(data.products.map(normalizeProduct));
                    }
                    break;
                case 'search_and_bookmark':
                    if (data.products.length > 0) {
                        setLastBookmarkedProducts(data.products);
                        setLatestFoundTiles(data.products.map(normalizeProduct));
                    }
                    break;
                case 'search_bookmark_collection':
                    if (data.collectionName && data.products && data.products.length > 0) {
                        addToCollection(data.products, data.collectionName, true);
                    }
                    if (data.products && data.products.length > 0) {
                        setLastBookmarkedProducts(data.products);
                        setLatestFoundTiles(data.products.map(normalizeProduct));
                    }
                    break;
                case 'collection':
                    if (data.action === 'collection' && data.collectionName) {
                        const latestTiles = getLatestFoundTiles();
                        if (latestTiles && latestTiles.length > 0) {
                            addToBookmarks(latestTiles);
                            addToCollection(latestTiles, data.collectionName, true);
                        }
                    }
                    if (data.products && data.products.length > 0) {
                        setLastBookmarkedProducts(data.products);
                        setLatestFoundTiles(data.products.map(normalizeProduct));
                    }
                    break;
                case 'bookmark':
                    let productsToBookmark = data.products;
                    if ((!productsToBookmark || productsToBookmark.length === 0)) {
                        productsToBookmark = getLatestFoundTiles();
                    }
                    if (productsToBookmark && productsToBookmark.length > 0) {
                        addToBookmarks(productsToBookmark);
                        setLastBookmarkedProducts(productsToBookmark);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const mockResponse: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: `Here are some tiles that match your search for "${inputMessage}". Note: This is mock data as the API is currently unavailable.`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, mockResponse]);
            toast.error('API is currently unavailable. Showing mock data.');
        }

        setIsLoading(false);
        setInputMessage('');
    };

    const handleBookmark = async (product: Product) => {
        try {
            const bookmarks = getBookmarks();
            const isAlreadyBookmarked = bookmarks.some((b: Bookmark) => b.productId === product.productId);

            if (isAlreadyBookmarked) {
                toast.error('Product is already bookmarked');
                return;
            }

            const newBookmark: Bookmark = {
                ...product,
                bookmarkedAt: Date.now()
            };

            const updatedBookmarks = [...bookmarks, newBookmark];
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            window.dispatchEvent(new Event('bookmarks-updated'));
            toast.success('Product added to bookmarks');
        } catch (error) {
            console.error('Error bookmarking product:', error);
            toast.error('Failed to bookmark product');
        }
    };

    // Helper to render collections with buttons
    const renderCollectionsList = () => {
        const collections = getCollections();
        if (collections.length === 0) {
            return (
                <div className="bg-gray-100 rounded-lg p-3 mt-2">You don't have any collections yet. You can create one by bookmarking tiles and adding them to a collection.</div>
            );
        }
        return (
            <div className="space-y-4 mt-2">
                {collections.map((collection) => (
                    <div key={collection.id || collection.name} className="flex items-center bg-gray-100 rounded-lg p-3">
                        <div className="flex-1">
                            <span role="img" aria-label="folder">📁</span> <span className="font-semibold">{collection.name}</span>
                            <span className="ml-2 text-sm text-gray-600">• {collection.products.length} tile{collection.products.length === 1 ? '' : 's'}</span>
                            <span className="ml-2 text-xs text-gray-400">• Last updated: {new Date(collection.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <button
                            className="ml-4 p-2 rounded-md hover:bg-gray-200"
                            onClick={() => {
                                setModalCollection(collection);
                                setShowCollectionModal(true);
                            }}
                        >
                            <Eye />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    // Helper to render bookmarks with style
    const renderBookmarksList = () => {
        const bookmarks = getBookmarks();
        if (bookmarks.length === 0) {
            return (
                <div className="bg-gray-100 rounded-lg p-3 mt-2">You don't have any bookmarks yet. Start bookmarking your favorite tiles!</div>
            );
        }
        return (
            <div className="space-y-4 mt-2">
                {bookmarks.map((bookmark, idx) => (
                    <div key={bookmark.productId || idx} className="flex items-center bg-gray-100 rounded-lg p-3">
                        <span className="mr-3 text-xl">⭐</span>
                        <div className="flex-1">
                            <div className="font-semibold">{bookmark.productDetails.Name}</div>
                            <div className="text-xs text-gray-600">
                                {bookmark.productDetails.Material} • {bookmark.productDetails["Color Group"]}
                                {bookmark.bookmarkedAt && (
                                    <span className="ml-2 text-gray-400">Bookmarked: {new Date(bookmark.bookmarkedAt).toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Khi khởi tạo, load lịch sử từ localStorage nếu có
    useEffect(() => {
        const stored = localStorage.getItem('chat_history');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setMessages(parsed);
            } catch { }
        }
    }, []);

    // Lưu lại mỗi khi messages thay đổi
    useEffect(() => {
        localStorage.setItem('chat_history', JSON.stringify(messages));
    }, [messages]);

    // Xóa lịch sử chat khi reload trang
    useEffect(() => {
        localStorage.removeItem('chat_history');
        localStorage.removeItem('latest_found_tiles'); // Clear latest found tiles on new chat
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (typeof window !== 'undefined') {
        localStorage.removeItem('chat_history');
    }

    return (
        <div className="flex flex-col h-full w-full max-w-full min-w-0">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">AI Tile Assistant</h2>
                <p className="text-sm text-gray-500">Ask me about our tiles!</p>
            </div>

            {/* Messages and Products */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message, index) => {
                    // Special handling for collection list message
                    if (message.content === '__SHOW_COLLECTIONS__') {
                        return <div key={message.id}>{renderCollectionsList()}</div>;
                    }
                    // Special handling for bookmarks list message
                    if (message.content === '__SHOW_BOOKMARKS__') {
                        return <div key={message.id}>{renderBookmarksList()}</div>;
                    }
                    return (
                        <div key={message.id}>
                            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`inline-block max-w-[80%] sm:max-w-[80%] rounded-lg p-3 break-words ${message.role === 'user'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-100'
                                    }`} style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                                    {message.content}
                                </div>
                            </div>
                            {/* Nếu message có products thì render UI sản phẩm */}
                            {message.role === 'assistant' && message.products && message.products.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {message.products.map((product, idx) => {
                                        const isBookmarked = (() => {
                                            try {
                                                const existingBookmarks = getBookmarks();
                                                return existingBookmarks.some((b: Bookmark) => b.productId === product.productId);
                                            } catch {
                                                return false;
                                            }
                                        })();
                                        const productKey = `product_${product.productId || idx}_${idx}`;
                                        return (
                                            <div
                                                key={productKey}
                                                className="border rounded-lg p-3 hover:shadow-lg transition-shadow bg-white relative group"
                                            >
                                                <button
                                                    onClick={() => handleBookmark(product)}
                                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md transition-colors z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-gray-100"
                                                >
                                                    {isBookmarked ? (
                                                        <BookmarkCheck size={18} className="text-amber-600 fill-current transition-colors" />
                                                    ) : (
                                                        <Bookmark size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                                                    )}
                                                </button>
                                                {product.productDetails.Images && product.productDetails.Images.length > 0 ? (
                                                    <div className="relative w-full aspect-square mb-2">
                                                        <Image
                                                            src={Array.isArray(product.productDetails.Images) ? product.productDetails.Images[0] : product.productDetails.Images}
                                                            alt={product.productDetails.Name}
                                                            fill
                                                            className="object-cover rounded"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full aspect-square mb-2 bg-gray-100 rounded flex items-center justify-center">
                                                        <span className="text-gray-400 text-sm">No image available</span>
                                                    </div>
                                                )}
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-sm truncate">{product.productDetails.Name}</h3>
                                                    <p className="text-xs text-gray-600">
                                                        ${product.productDetails.unit_price?.toFixed(2)} per unit
                                                    </p>
                                                    <div className="text-xs text-gray-500">
                                                        <p>Material: {product.productDetails.Material}</p>
                                                        <p>Size: {product.productDetails['Size Advanced']}</p>
                                                        <p>Color: {product.productDetails['Color Group']}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            <span className="thinking-text">
                                <span className="thinking-word">Thinking</span>
                                <span className="dot-1">.</span>
                                <span className="dot-2">.</span>
                                <span className="dot-3">.</span>
                            </span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Modal for collection images */}
            <ReactModal
                isOpen={showCollectionModal}
                onRequestClose={() => setShowCollectionModal(false)}
                shouldCloseOnOverlayClick={true}
                ariaHideApp={false}
                className="fixed inset-0 flex items-center justify-center z-[9999] bg-transparent"
                overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-lg z-[9998]"
            >
                <div className="bg-white rounded-2xl shadow-lg p-0 max-w-5xl w-full h-[90vh] flex flex-col relative overflow-hidden">
                    <div className="sticky top-0 z-20 flex items-center justify-between bg-white px-6 pt-6 pb-2 rounded-t-2xl" style={{ marginTop: 0 }}>
                        <h2 className="text-lg font-semibold">{modalCollection?.name} - Images</h2>
                        <button
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold rounded-full p-1"
                            onClick={() => setShowCollectionModal(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {modalCollection && modalCollection.products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {modalCollection.products.map((product, idx) => (
                                    <div key={product.productId ? `${product.productId}_${idx}` : idx} className="flex flex-col items-center">
                                        {product.productDetails.Images && product.productDetails.Images.length > 0 ? (
                                            <Image
                                                src={Array.isArray(product.productDetails.Images) ? product.productDetails.Images[0] : product.productDetails.Images}
                                                alt={product.productDetails.Name}
                                                width={120}
                                                height={120}
                                                className="object-cover rounded mb-2"
                                            />
                                        ) : (
                                            <div className="w-[120px] h-[120px] bg-gray-100 flex items-center justify-center rounded mb-2">
                                                <span className="text-gray-400 text-xs">No image</span>
                                            </div>
                                        )}
                                        <div className="text-xs text-center">{product.productDetails.Name}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500">No images in this collection.</div>
                        )}
                    </div>
                </div>
            </ReactModal>

            {/* Input Area */}
            <div className="p-4 border-t bg-white rounded-b-2xl">
                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about tiles..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm min-w-0"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Thêm style cho animation ở cuối file, trước thẻ đóng cuối cùng */}
            <style jsx>{`
                .thinking-text {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                }
                .thinking-word {
                    background: linear-gradient(90deg, #4a5568, #718096, #4a5568);
                    background-size: 200% auto;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shine 3s linear infinite;
                    font-weight: 500;
                }
                .dot-1, .dot-2, .dot-3 {
                    opacity: 0;
                    animation: thinking 1.4s infinite;
                    margin-left: 1px;
                }
                .dot-2 {
                    animation-delay: 0.2s;
                }
                .dot-3 {
                    animation-delay: 0.4s;
                }
                @keyframes thinking {
                    0% { opacity: 0; transform: translateY(0); }
                    20% { opacity: 1; transform: translateY(-2px); }
                    100% { opacity: 0; transform: translateY(0); }
                }
                @keyframes shine {
                    0% { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }
            `}</style>

            {/* Thêm media query cho modal ở cuối file, trước thẻ đóng cuối cùng */}
            <style jsx global>{`
                @media (max-width: 600px) {
                    .ReactModal__Content {
                        width: 100vw !important;
                        max-width: 100vw !important;
                        min-width: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        border-radius: 0 !important;
                        padding: 0 !important;
                    }
                    .ReactModal__Overlay {
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
} 