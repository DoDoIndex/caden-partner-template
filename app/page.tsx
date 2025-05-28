'use client';

import { useState, useEffect } from 'react';
import Banner from "@/components/Homepage/banner";
import SidebarWrapper from "@/app/components/Homepage/sidebar-wrapper";
import CardProduct from "@/app/components/Homepage/card-product";
import ListProduct from "@/app/components/Homepage/list-product";
import { Product } from "@/app/types/product";
import React from 'react';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;
  const [filters, setFilters] = useState({
    sort: ''
  });

  // Fetch products khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Cập nhật filteredProducts khi products thay đổi
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/catalog');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
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

  const handleSidebarFilter = React.useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  }, []);

  const sortedProducts = React.useMemo(() => {
    if (!filters.sort) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      switch (filters.sort) {
        case 'price_asc':
          return (a.productDetails.unit_price || a.productDetails?.unit_price || 0) - (b.productDetails.unit_price || b.productDetails?.unit_price || 0);
        case 'price_desc':
          return (b.productDetails.unit_price || b.productDetails?.unit_price || 0) - (a.productDetails.unit_price || a.productDetails?.unit_price || 0);
        case 'name_asc':
          return (a.productDetails?.Name || '').localeCompare(b.productDetails?.Name || '');
        case 'name_desc':
          return (b.productDetails?.Name || '').localeCompare(a.productDetails?.Name || '');
        default:
          return 0;
      }
    });
  }, [filteredProducts, filters.sort]);

  // Tính toán phân trang với sản phẩm đã lọc và sắp xếp
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Banner Section - Full Width */}
      <div className="w-full">
        <Banner />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <SidebarWrapper products={products} onFilterChange={handleSidebarFilter} />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Filters and Sort */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <select
                  className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="">Sort by</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 border border-gray-200'}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 border border-gray-200'}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4"
                : "space-y-4"
              }>
                {currentProducts.map((product, index) => (
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
            {!loading && !error && sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <nav className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-sm transition-colors ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-lg px-3 sm:px-4 py-2 text-sm transition-colors ${currentPage === page
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-sm transition-colors ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}