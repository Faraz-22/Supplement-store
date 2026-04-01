// src/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleCart } from '@/store/slices/cartSlice';

const categories = [
  {
    name: 'Proteins',
    items: ['Whey Protein', 'Mass Gainer', 'Casein', 'Plant Protein'],
  },
  {
    name: 'Workout',
    items: ['Pre-Workout', 'Post-Workout', 'Intra-Workout', 'Energy Drinks'],
  },
  {
    name: 'Performance',
    items: ['Creatine', 'BCAA', 'Amino Acids', 'Glutamine'],
  },
  {
    name: 'Health',
    items: ['Vitamins', 'Fish Oil', 'Multivitamins', 'Immunity'],
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { totalItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark-900 border-b border-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs text-gray-400">
            <div className="hidden md:flex items-center gap-6">
              <span>Free Shipping on Orders Above ₹999</span>
              <span className="text-primary-500">•</span>
              <span>100% Authentic Products</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/track-order" className="hover:text-primary-500 transition-colors">
                Track Order
              </Link>
              <span className="text-dark-600">|</span>
              <Link href="/help" className="hover:text-primary-500 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-900/95 backdrop-blur-md shadow-lg border-b border-dark-700'
            : 'bg-dark-900 border-b border-dark-800'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 bg-primary-gradient rounded-lg flex items-center justify-center shadow-glow-orange group-hover:shadow-glow-orange-lg transition-shadow duration-300">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <div className="hidden md:block">
                <div className="font-display text-2xl font-bold text-white leading-none group-hover:text-primary-500 transition-colors">
                  FITPRO
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Premium Supplements
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(category.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:text-primary-500 transition-colors uppercase tracking-wide">
                    {category.name}
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === category.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-4 w-56 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden"
                      >
                        <div className="p-4">
                          {category.items.map((item) => (
                            <Link
                              key={item}
                              href={`/products?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
                              className="block px-4 py-2 text-sm text-gray-300 hover:text-primary-500 hover:bg-dark-700 rounded-md transition-colors"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-dark-700 p-3 bg-dark-900">
                          <Link
                            href={`/products?category=${category.name.toLowerCase()}`}
                            className="text-xs text-primary-500 hover:text-primary-400 font-semibold"
                          >
                            View All {category.name} →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <Link
                href="/deals"
                className="text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-wide"
              >
                🔥 Deals
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:flex p-2 text-gray-300 hover:text-primary-500 transition-colors relative"
              >
                <Heart size={22} />
              </Link>

              {/* User */}
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg hover:border-primary-500 transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm font-medium text-white">{user?.firstName}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-gradient text-white font-semibold rounded-lg hover:shadow-glow-orange transition-all"
                >
                  <User size={18} />
                  <span className="text-sm">Login</span>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-gray-300 hover:text-primary-500 transition-colors"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-glow-orange"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-primary-500 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-dark-800 bg-dark-900 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>

                {/* Mobile Categories */}
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h3 className="font-bold text-white uppercase text-sm tracking-wide">
                      {category.name}
                    </h3>
                    <div className="pl-4 space-y-2">
                      {category.items.map((item) => (
                        <Link
                          key={item}
                          href={`/products?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-gray-400 hover:text-primary-500 text-sm"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
