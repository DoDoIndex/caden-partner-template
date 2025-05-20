'use client';

import { Suspense } from 'react';
import Sidebar from './sidebar';

export default function SidebarWrapper() {
    return (
        <Suspense fallback={<div>Loading filters...</div>}>
            <Sidebar />
        </Suspense>
    );
} 