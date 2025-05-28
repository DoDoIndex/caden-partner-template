"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Loader2, Bookmark, BookmarkCheck } from 'lucide-react';
import ReactModal from 'react-modal';

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

interface SearchCriteria {
    searchType: "Material" | "Color Group" | "Size" | "Usage" | "Trim";
    searchValue: string;
}

interface CombinedSearchBookmarkResponse {
    action: "search_and_bookmark";
    criteria: SearchCriteria[];
    bookmarkResponse: string;
    askCollection: boolean;
    collectionPrompt: string;
}

interface CombinedSearchBookmarkCollectionResponse {
    action: "search_bookmark_collection";
    criteria: SearchCriteria[];
    bookmarkResponse: string;
    collectionName: string;
    collectionResponse: string;
}

type CombinedResponse = CombinedSearchBookmarkResponse | CombinedSearchBookmarkCollectionResponse;

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
            Images: product.productDetails?.Images || '',
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
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant' as const,
            content: "I can help you find tiles based on Material, Color Group, Size, Usage, or Trim. Please specify what you're looking for. For example: 'Show me porcelain tiles' or 'Find tiles for indoor walls'",
            timestamp: Date.now()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [askingAboutCollection, setAskingAboutCollection] = useState(false);
    const [lastBookmarkedProducts, setLastBookmarkedProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [modalCollection, setModalCollection] = useState<Collection | null>(null);
    const [showChat, setShowChat] = useState(true);

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

    // Initialize with empty state and update after mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Load initial collections
        const collections = getCollections();
        if (collections.length > 0) {
            setCollections(collections);
        }
    }, []);

    const handleCollectionResponse = (input: string) => {
        if (!lastBookmarkedProducts.length) {
            setAskingAboutCollection(false);
            return;
        }

        const newCollectionMatch = input.match(/^(?:new:|create:?)\s*(.+)$/i);
        if (newCollectionMatch) {
            // Handle new collection creation
            const collectionName = newCollectionMatch[1].trim();
            const success = addToCollection(lastBookmarkedProducts, collectionName, true);

            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: success
                    ? `I've created a new collection called '${collectionName}' and added these tiles to it. Is there anything else you'd like to do?`
                    : `Sorry, I couldn't create the collection. Please try again.`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } else {
            // Handle existing collection
            const collections = getCollections();
            const collectionName = input.replace(/^add to\s*/i, '').trim();
            const collectionExists = collections.some(c => c.name.toLowerCase() === collectionName.toLowerCase());

            if (collectionExists) {
                const success = addToCollection(lastBookmarkedProducts, collectionName);
                const assistantMessage: ChatMessage = {
                    id: generateId(),
                    role: 'assistant',
                    content: success
                        ? `I've added these tiles to your '${collectionName}' collection. Is there anything else you'd like to do?`
                        : `Sorry, I couldn't add the tiles to the collection. Please try again.`,
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                const assistantMessage: ChatMessage = {
                    id: generateId(),
                    role: 'assistant',
                    content: `I couldn't find a collection called '${collectionName}'. Would you like to create it as a new collection? You can say "new: ${collectionName}"`,
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        }

        setAskingAboutCollection(false);
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

        // Check for collection viewing request
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

        if (askingAboutCollection) {
            handleCollectionResponse(inputMessage);
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

            // Normalize products from API response
            const normalizedProducts = data.products.map(normalizeProduct);
            setProducts(normalizedProducts);

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

            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: data.message,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, assistantMessage]);

            // Handle different actions
            switch (data.action) {
                case 'search_and_bookmark':
                    if (data.products.length > 0) {
                        try {
                            const newBookmarks = addToBookmarks(data.products);
                            if (newBookmarks.length > 0) {
                                setLastBookmarkedProducts(newBookmarks);
                                setAskingAboutCollection(true);
                                toast.success(`${newBookmarks.length} tile${newBookmarks.length === 1 ? '' : 's'} added to bookmarks`);
                            }
                        } catch (error) {
                            console.error('Error adding to bookmarks:', error);
                            toast.error('Failed to add tiles to bookmarks');
                        }
                    }
                    break;

                case 'search_bookmark_collection':
                    if (data.products.length > 0 && data.collectionName) {
                        try {
                            const newBookmarks = addToBookmarks(data.products);
                            if (newBookmarks.length > 0) {
                                const success = addToCollection(newBookmarks, data.collectionName, true);
                                if (success) {
                                    toast.success(`${newBookmarks.length} tile${newBookmarks.length === 1 ? '' : 's'} added to bookmarks and collection`);
                                } else {
                                    toast.error('Failed to add tiles to collection');
                                }
                            }
                        } catch (error) {
                            console.error('Error in combined action:', error);
                            toast.error('Failed to complete the combined action');
                        }
                    }
                    break;

                case 'bookmark':
                    if (data.askCollection) {
                        setAskingAboutCollection(true);
                    }
                    break;

                case 'collection':
                    setAskingAboutCollection(true);
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
            // Normalize mock products
            const normalizedMockProducts = MOCK_PRODUCTS.map(normalizeProduct);
            setProducts(normalizedMockProducts);
            toast.error('API is currently unavailable. Showing mock data.');
        }

        setIsLoading(false);
        setInputMessage('');
    };

    const handleBookmark = async (product: Product) => {
        try {
            // Get existing bookmarks from localStorage
            const existingBookmarks = getBookmarks();

            // Check if product is already bookmarked
            const isAlreadyBookmarked = existingBookmarks.some((b: Bookmark) => b.productId === product.productId);

            if (isAlreadyBookmarked) {
                toast.error('Product is already bookmarked');
                return;
            }

            // Add new bookmark
            const updatedBookmarks = [...existingBookmarks, { ...product, bookmarkedAt: Date.now() }];
            saveBookmarks(updatedBookmarks);

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
                    <div key={collection.id} className="flex items-center bg-gray-100 rounded-lg p-3">
                        <div className="flex-1">
                            <span role="img" aria-label="folder">📁</span> <span className="font-semibold">{collection.name}</span>
                            <span className="ml-2 text-sm text-gray-600">• {collection.products.length} tile{collection.products.length === 1 ? '' : 's'}</span>
                            <span className="ml-2 text-xs text-gray-400">• Last updated: {new Date(collection.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <button
                            className="ml-4 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            onClick={() => {
                                setModalCollection(collection);
                                setShowCollectionModal(true);
                            }}
                        >
                            View Images
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
                {bookmarks.map((bookmark) => (
                    <div key={bookmark.productId} className="flex items-center bg-gray-100 rounded-lg p-3">
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

    return (
        <div className="flex flex-col h-full">
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
                                <div className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-100'
                                    }`}>
                                    {message.content}
                                </div>
                            </div>
                            {/* Display products after assistant messages */}
                            {message.role === 'assistant' && index === messages.length - 1 && products.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map((product, index) => {
                                        const isBookmarked = (() => {
                                            try {
                                                const existingBookmarks = getBookmarks();
                                                return existingBookmarks.some((b: Bookmark) => b.productId === product.productId);
                                            } catch {
                                                return false;
                                            }
                                        })();

                                        const productKey = `product_${product.productId || index}_${index}`;

                                        return (
                                            <div
                                                key={productKey}
                                                className="border rounded-lg p-3 hover:shadow-lg transition-shadow bg-white relative group"
                                            >
                                                <button
                                                    onClick={() => handleBookmark(product)}
                                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors z-10"
                                                >
                                                    {isBookmarked ? (
                                                        <BookmarkCheck className="h-5 w-5 text-gray-500" />
                                                    ) : (
                                                        <Bookmark className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
                                                    )}
                                                </button>
                                                {product.productDetails['Photo Hover'] && (
                                                    <div className="relative w-full aspect-square mb-2">
                                                        <Image
                                                            src={product.productDetails['Photo Hover']}
                                                            alt={product.productDetails.Name}
                                                            fill
                                                            className="object-cover rounded"
                                                        />
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
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
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
                                    <div key={product.productId + '_' + idx} className="flex flex-col items-center">
                                        {product.productDetails['Photo Hover'] ? (
                                            <Image
                                                src={product.productDetails['Photo Hover']}
                                                alt={product.productDetails.Name}
                                                width={120}
                                                height={120}
                                                className="object-cover rounded mb-2"
                                            />
                                        ) : (
                                            <div className="w-[120px] h-[120px] bg-gray-200 flex items-center justify-center rounded mb-2 text-xs text-gray-500">No Image</div>
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
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about tiles..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
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
        </div>
    );
} 