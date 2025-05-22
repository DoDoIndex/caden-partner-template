'use client';

import { Suspense } from 'react';
import Sidebar from './sidebar';
import { Product } from "@/app/types/product";

interface SidebarWrapperProps {
    products: Product[];
    onFilterChange: (filteredProducts: Product[]) => void;
}

export default function SidebarWrapper({ products, onFilterChange }: SidebarWrapperProps) {
    return (
        <Suspense fallback={<div>Loading filters...</div>}>
            <Sidebar products={products} onFilterChange={onFilterChange} />
        </Suspense>
    );
} 