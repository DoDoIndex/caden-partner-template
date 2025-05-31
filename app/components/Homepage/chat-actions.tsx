'use client';

import { Product } from "@/app/types/product";
import toast from 'react-hot-toast';

interface ChatResponse {
    action: string;
    products: Product[];
    message: string;
    askCollection?: boolean;
    collectionPrompt?: string;
    collectionName?: string;
    error?: boolean;
    showCollection?: boolean;
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

export const handleChatActions = (response: ChatResponse): void => {
    if (response.error) {
        toast.error(response.message);
        return;
    }

    switch (response.action) {
        case 'search_and_bookmark':
        case 'search_bookmark_collection':
        case 'bookmark':
            if (response.products && response.products.length > 0) {
                addToBookmarks(response.products);
            }
            break;

        case 'collection':
            if (response.collectionName) {
                createCollection(response.collectionName);
            }
            break;

        case 'show_collection':
            if (response.collectionName) {
                showCollection(response.collectionName);
            }
            break;
    }
};

const addToBookmarks = (products: Product[]): void => {
    try {
        const existingBookmarks = getBookmarks();
        const newBookmarks: Bookmark[] = [];

        products.forEach(product => {
            if (!existingBookmarks.some(b => b.productId === product.productId)) {
                let details = { ...product.productDetails };
                if ((details as any).Image) {
                    details.Images = [(details as any).Image];
                    delete (details as any).Image;
                } else if (details["Photo Hover"]) {
                    details.Images = [details["Photo Hover"]];
                } else if (details.Images && typeof details.Images === 'string') {
                    details.Images = [details.Images];
                }
                newBookmarks.push({
                    ...product,
                    productDetails: details,
                    bookmarkedAt: Date.now()
                });
            }
        });

        if (newBookmarks.length > 0) {
            const updatedBookmarks = [...existingBookmarks, ...newBookmarks];
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            window.dispatchEvent(new Event('bookmarks-updated'));
            toast.success(`${newBookmarks.length} tile${newBookmarks.length === 1 ? '' : 's'} added to bookmarks`);
        }
    } catch (error) {
        console.error('Error adding to bookmarks:', error);
        toast.error('Failed to add tiles to bookmarks');
    }
};

const createCollection = (collectionName: string): void => {
    try {
        const collections = getCollections();
        const now = Date.now();

        // Check if collection already exists
        if (collections.some(c => c.name.toLowerCase() === collectionName.toLowerCase())) {
            toast.error(`Collection '${collectionName}' already exists`);
            return;
        }

        const newCollection: Collection = {
            id: `collection_${now}`,
            name: collectionName,
            products: [],
            createdAt: now,
            updatedAt: now
        };

        collections.push(newCollection);
        localStorage.setItem('collections', JSON.stringify(collections));
        window.dispatchEvent(new Event('collections-updated'));
        toast.success(`Collection '${collectionName}' created successfully`);
    } catch (error) {
        console.error('Error creating collection:', error);
        toast.error('Failed to create collection');
    }
};

const addToCollection = (products: Product[], collectionName: string): void => {
    try {
        const collections = getCollections();
        const collection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());

        if (!collection) {
            toast.error(`Collection '${collectionName}' not found`);
            return;
        }

        const now = Date.now();
        const newProducts = products.filter(product =>
            !collection.products.some(p => p.productId === product.productId)
        ).map(p => {
            let details = { ...p.productDetails };
            if ((details as any).Image) {
                details.Images = [(details as any).Image];
                delete (details as any).Image;
            } else if (details["Photo Hover"]) {
                details.Images = [details["Photo Hover"]];
            } else if (details.Images && typeof details.Images === 'string') {
                details.Images = [details.Images];
            }
            return { ...p, productDetails: details, bookmarkedAt: now };
        });

        if (newProducts.length > 0) {
            collection.products.push(...newProducts);
            collection.updatedAt = now;
            localStorage.setItem('collections', JSON.stringify(collections));
            window.dispatchEvent(new Event('collections-updated'));
            toast.success(`${newProducts.length} tile${newProducts.length === 1 ? '' : 's'} added to collection '${collectionName}'`);
        }
    } catch (error) {
        console.error('Error adding to collection:', error);
        toast.error('Failed to add tiles to collection');
    }
};

export const getBookmarks = (): Bookmark[] => {
    try {
        const bookmarksStr = localStorage.getItem('bookmarks');
        return bookmarksStr ? JSON.parse(bookmarksStr) : [];
    } catch (error) {
        console.error('Error getting bookmarks:', error);
        return [];
    }
};

export const getCollections = (): Collection[] => {
    try {
        const collectionsStr = localStorage.getItem('collections');
        return collectionsStr ? JSON.parse(collectionsStr) : [];
    } catch (error) {
        console.error('Error getting collections:', error);
        return [];
    }
};

export const removeFromBookmarks = (productId: number): void => {
    try {
        const bookmarks = getBookmarks();
        const updatedBookmarks = bookmarks.filter(b => b.productId !== productId);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        window.dispatchEvent(new Event('bookmarks-updated'));
        toast.success('Removed from bookmarks');
    } catch (error) {
        console.error('Error removing from bookmarks:', error);
        toast.error('Failed to remove from bookmarks');
    }
};

export const deleteCollection = (collectionId: string): void => {
    try {
        const collections = getCollections();
        const updatedCollections = collections.filter(c => c.id !== collectionId);
        localStorage.setItem('collections', JSON.stringify(updatedCollections));
        window.dispatchEvent(new Event('collections-updated'));
        toast.success('Collection deleted successfully');
    } catch (error) {
        console.error('Error deleting collection:', error);
        toast.error('Failed to delete collection');
    }
};

export const showCollection = (collectionName: string): { message: string; products: Product[] } => {
    try {
        const collections = getCollections();
        const collection = collections.find(c => c.name.toLowerCase() === collectionName.toLowerCase());

        if (!collection) {
            return {
                message: `Collection '${collectionName}' not found.`,
                products: []
            };
        }

        if (collection.products.length === 0) {
            return {
                message: `Collection '${collectionName}' is empty.`,
                products: []
            };
        }

        return {
            message: `Here are the tiles in collection '${collectionName}':`,
            products: collection.products
        };
    } catch (error) {
        console.error('Error showing collection:', error);
        return {
            message: 'Failed to fetch collection.',
            products: []
        };
    }
}; 