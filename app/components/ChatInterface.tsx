"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Loader2, Bookmark, BookmarkCheck } from 'lucide-react';

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
        Material: string;
        'Color Group': string;
        Size: string;
        Usage: string;
        Trim: string;
        'Photo Hover': string;
        unit_price: number;
        Name: string;
        Collection: string;
        'Coverage (sqft)': string;
        'Size Advanced': string;
    };
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface Collection {
    id?: string;
    name: string;
    products: Product[];
}

interface ChatResponse {
    message: string;
    products: Product[];
}

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

    const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const getCollections = (): Collection[] => {
        try {
            const collectionsStr = localStorage.getItem('collections');
            return collectionsStr ? JSON.parse(collectionsStr) : [];
        } catch (error) {
            console.error('Error getting collections:', error);
            return [];
        }
    };

    const saveToCollection = (products: Product[], collectionName: string, isNew: boolean = false) => {
        try {
            const collections = getCollections();

            // Map products to include partnerPrice if available
            const mappedProducts = products.map((product: any) => {
                // Try to get partnerPrice from product or productDetails
                let partnerPrice = product.partnerPrice;
                if (!partnerPrice && product.productDetails && product.productDetails.partnerPrice) {
                    partnerPrice = product.productDetails.partnerPrice;
                }
                return {
                    productId: product.productId,
                    partnerPrice: partnerPrice ? String(partnerPrice) : undefined,
                    productDetails: product.productDetails
                };
            });

            if (isNew) {
                // Create new collection with required structure
                const newCollection = {
                    name: collectionName,
                    products: mappedProducts
                };
                collections.push(newCollection);
            } else {
                // Add to existing collection
                const existingCollection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());
                if (existingCollection) {
                    // Filter out duplicates
                    const newProducts = mappedProducts.filter(product =>
                        !existingCollection.products.some((p: any) => p.productId === product.productId)
                    );
                    existingCollection.products.push(...newProducts);
                } else {
                    throw new Error('Collection not found');
                }
            }

            localStorage.setItem('collections', JSON.stringify(collections));
            window.dispatchEvent(new Event('collections-updated'));
            return true;
        } catch (error) {
            console.error('Error saving to collection:', error);
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
            const success = saveToCollection(lastBookmarkedProducts, collectionName, true);

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
                const success = saveToCollection(lastBookmarkedProducts, collectionName);
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

        if (askingAboutCollection) {
            handleCollectionResponse(inputMessage);
            setInputMessage('');
            return;
        }

        // Handle "Add to bookmark" command
        if (inputMessage.toLowerCase().trim() === "add to bookmark") {
            if (products.length === 0) {
                const assistantMessage: ChatMessage = {
                    id: generateId(),
                    role: 'assistant',
                    content: "There are no tiles currently displayed to bookmark.",
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, assistantMessage]);
                setInputMessage('');
                return;
            }

            try {
                const existingBookmarksStr = localStorage.getItem('bookmarks');
                const existingBookmarks = existingBookmarksStr ? JSON.parse(existingBookmarksStr) : [];

                // Filter out products that are already bookmarked
                const newBookmarks = products.filter(product =>
                    !existingBookmarks.some((b: Product) => b.productId === product.productId)
                );

                if (newBookmarks.length === 0) {
                    const assistantMessage: ChatMessage = {
                        id: generateId(),
                        role: 'assistant',
                        content: "All displayed tiles are already in your bookmarks.",
                        timestamp: Date.now()
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                    setInputMessage('');
                    return;
                }

                // Add new bookmarks
                const updatedBookmarks = [...existingBookmarks, ...newBookmarks];
                localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
                window.dispatchEvent(new Event('bookmarks-updated'));

                // Store bookmarked products for collection handling
                setLastBookmarkedProducts(newBookmarks);
                setAskingAboutCollection(true);

                const assistantMessage: ChatMessage = {
                    id: generateId(),
                    role: 'assistant',
                    content: `I've added ${newBookmarks.length} tile${newBookmarks.length === 1 ? '' : 's'} to your bookmarks successfully! Would you like to add these tiles to a collection? You can choose an existing collection or create a new one by typing "new: [collection name]".`,
                    timestamp: Date.now()
                };

                setMessages(prev => [...prev, assistantMessage]);
                toast.success(`${newBookmarks.length} tile${newBookmarks.length === 1 ? '' : 's'} added to bookmarks`);
                setInputMessage('');
                return;
            } catch (error) {
                console.error('Error adding to bookmarks:', error);
                toast.error('Failed to add tiles to bookmarks');
                return;
            }
        }

        setIsLoading(true);

        try {
            // Try to fetch from the API route
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

            const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: data.message,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, assistantMessage]);
            setProducts(data.products);
        } catch (error) {
            console.error('Error sending message:', error);

            // Use mock data when API is not available
            const mockResponse: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: `Here are some tiles that match your search for "${inputMessage}". Note: This is mock data as the API is currently unavailable.`,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, mockResponse]);
            setProducts(MOCK_PRODUCTS);

            toast.error('API is currently unavailable. Showing mock data.');
        }

        setIsLoading(false);
        setInputMessage('');
    };

    const handleBookmark = async (product: Product) => {
        try {
            // Get existing bookmarks from localStorage
            const existingBookmarksStr = localStorage.getItem('bookmarks');
            const existingBookmarks = existingBookmarksStr ? JSON.parse(existingBookmarksStr) : [];

            // Check if product is already bookmarked
            const isAlreadyBookmarked = existingBookmarks.some((b: Product) => b.productId === product.productId);

            if (isAlreadyBookmarked) {
                toast.error('Product is already bookmarked');
                return;
            }

            // Add new bookmark
            const updatedBookmarks = [...existingBookmarks, product];
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            window.dispatchEvent(new Event('bookmarks-updated'));

            toast.success('Product added to bookmarks');
        } catch (error) {
            console.error('Error bookmarking product:', error);
            toast.error('Failed to bookmark product');
        }
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
                {messages.map((message, index) => (
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
                                            const existingBookmarksStr = localStorage.getItem('bookmarks');
                                            const existingBookmarks = existingBookmarksStr ? JSON.parse(existingBookmarksStr) : [];
                                            return existingBookmarks.some((b: Product) => b.productId === product.productId);
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
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
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