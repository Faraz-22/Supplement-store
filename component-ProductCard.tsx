// src/components/products/ProductCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; altText?: string }[];
  brand: string;
  averageRating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    dispatch(addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0]?.url || '/placeholder.png',
      quantity: 1,
      stock: product.stock,
    }));
  };

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden rounded-lg bg-dark-800 border border-dark-700 transition-all duration-300 hover:border-primary-500 hover:shadow-glow-orange">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-dark-900">
            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.images[0]?.altText || product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Skeleton loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 animate-pulse" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.isNewArrival && (
                <span className="px-3 py-1 text-xs font-bold uppercase bg-primary-500 text-white rounded-md shadow-lg">
                  New
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="px-3 py-1 text-xs font-bold uppercase bg-red-600 text-white rounded-md shadow-lg">
                  -{discountPercentage}%
                </span>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <span className="px-3 py-1 text-xs font-bold uppercase bg-yellow-600 text-white rounded-md shadow-lg">
                  Low Stock
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-3 py-1 text-xs font-bold uppercase bg-gray-600 text-white rounded-md shadow-lg">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quick Actions - Show on hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 flex flex-col gap-2"
            >
              <button
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-200 shadow-lg"
                aria-label="Add to wishlist"
              >
                <Heart size={18} />
              </button>
              <button
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-200 shadow-lg"
                aria-label="Quick view"
              >
                <Eye size={18} />
              </button>
            </motion.div>

            {/* Gradient overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
            />
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Brand */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">
              {product.brand}
            </p>

            {/* Name */}
            <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-400 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.averageRating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-600'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl font-bold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                product.stock === 0
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-glow-orange active:scale-95'
              }`}
            >
              <ShoppingCart size={18} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
