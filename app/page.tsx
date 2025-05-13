import Baner from "@/components/Homepage/baner";
import Sidebar from "@/components/Homepage/sidebar";
import CardProduct from "@/components/Homepage/card-product";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Baner />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-4">
              <Sidebar />
            </div>
          </div>

          {/* Mobile Sidebar Toggle - Only shown on mobile */}
          <div className="lg:hidden mb-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Show Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Filters and Sort */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <select className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option>Sort by</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <span className="text-sm text-gray-600">12 products</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
            </div>

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
      </div>
    </main>
  );
}