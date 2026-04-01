// src/app/(user)/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Grid3x3, List } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

interface FilterState {
  category: string[];
  brand: string[];
  type: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    brand: [],
    type: [],
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'createdAt',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
      });

      // Add array filters
      if (filters.category.length > 0) {
        params.append('category', filters.category.join(','));
      }
      if (filters.brand.length > 0) {
        params.append('brand', filters.brand.join(','));
      }
      if (filters.type.length > 0) {
        params.append('type', filters.type.join(','));
      }

      // Add search param if exists
      const search = searchParams.get('search');
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      type: [],
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'createdAt',
    });
  };

  const activeFilterCount =
    filters.category.length +
    filters.brand.length +
    filters.type.length +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 10000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              All Products
            </h1>
            <p className="text-gray-400">
              {pagination.total} products found
            </p>
          </div>

          {/* View Mode Toggle - Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-dark-800 border border-dark-700 rounded-lg p-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600"
              >
                <Filter size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="createdAt">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <ProductGridSkeleton />
            ) : products.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) =>
                      setPagination((prev) => ({ ...prev, page }))
                    }
                  />
                )}
              </>
            ) : (
              <EmptyState onClearFilters={clearFilters} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}

function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: any) {
  const categories = [
    'Whey Protein',
    'Mass Gainer',
    'Pre-Workout',
    'Post-Workout',
    'Creatine',
    'Vitamins',
  ];

  const brands = [
    'Optimum Nutrition',
    'MyProtein',
    'MuscleTech',
    'Dymatize',
    'BSN',
    'Universal',
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-500 hover:text-primary-400"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Min Price (₹)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                onFilterChange('minPrice', parseInt(e.target.value) || 0)
              }
              className="w-full mt-1 px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Max Price (₹)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                onFilterChange('maxPrice', parseInt(e.target.value) || 10000)
              }
              className="w-full mt-1 px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.category.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.category, category]
                    : filters.category.filter((c: string) => c !== category);
                  onFilterChange('category', newCategories);
                }}
                className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.brand.includes(brand)}
                onChange={(e) => {
                  const newBrands = e.target.checked
                    ? [...filters.brand, brand]
                    : filters.brand.filter((b: string) => b !== brand);
                  onFilterChange('brand', newBrands);
                }}
                className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-dark-900 z-50 overflow-y-auto lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <FilterPanel
                filters={filters}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
                activeFilterCount={activeFilterCount}
              />

              <button
                onClick={onClose}
                className="w-full mt-6 py-3 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg hover:border-primary-500"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            page === currentPage
              ? 'bg-primary-500 text-white'
              : 'bg-dark-800 border border-dark-700 text-white hover:border-primary-500'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg hover:border-primary-500"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-dark-800 rounded-full flex items-center justify-center">
          <Filter size={48} className="text-gray-600" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
      <p className="text-gray-400 mb-6">
        Try adjusting your filters to see more products
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange"
      >
        Clear All Filters
      </button>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-dark-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-dark-700 rounded w-3/4" />
            <div className="h-4 bg-dark-700 rounded w-1/2" />
            <div className="h-8 bg-dark-700 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
