'use client';

import { useState, useEffect } from 'react';
import Baner from "@/components/Homepage/baner";
import Sidebar from "@/components/Homepage/sidebar";
import CardProduct from "@/app/components/Homepage/card-product";
import ListProduct from "@/app/components/Homepage/list-product";
import { Product } from "@/app/types/product";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/catalog?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        console.log('Products JSON:', JSON.stringify(data.data, null, 2));
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      {/* Banner Section - Full Width */}
      <div className="w-full">
        <Baner />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Filters and Sort */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <select
                  className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="">Sort by</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <span className="text-sm text-gray-600">{products.length} products</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
                  title="List View"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-all ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
                  title="Grid View"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Product Grid/List */}
            {!loading && !error && (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-4"
              }>
                {products.map((product, index) => (
                  <div key={`${viewMode}-${product.productId || index}`}>
                    {viewMode === 'grid' ? (
                      <CardProduct product={product} />
                    ) : (
                      <ListProduct product={product} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <nav className="flex flex-wrap items-center justify-center gap-2">
                <button className="rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="rounded-lg bg-primary px-3 sm:px-4 py-2 text-sm text-white hover:bg-primary/90">
                  1
                </button>
                <button className="rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 text-sm hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}