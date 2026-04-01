// src/app/(user)/products/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  Check,
  Minus,
  Plus,
  Share2,
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images[0]?.url || '/placeholder.png',
          quantity,
          stock: product.stock,
        })
      );
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-400">
          <a href="/" className="hover:text-primary-500">
            Home
          </a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-primary-500">
            Products
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div>
            {/* Brand & Title */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {product.name}
              </h1>
              <p className="text-gray-400">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-700">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.averageRating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-600'
                    }
                  />
                ))}
              </div>
              <span className="text-white font-semibold">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-400">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-dark-700">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-400">Inclusive of all taxes</p>
            </div>

            {/* Product Details */}
            <div className="space-y-3 mb-6 pb-6 border-b border-dark-700">
              {product.flavor && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Flavor:</span>
                  <span className="text-white font-semibold">{product.flavor}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Weight:</span>
                  <span className="text-white font-semibold">{product.weight}</span>
                </div>
              )}
              {product.servingsPerContainer && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Servings:</span>
                  <span className="text-white font-semibold">
                    {product.servingsPerContainer} servings
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Availability:</span>
                <span
                  className={`font-semibold ${
                    product.stock > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-dark-800 border border-dark-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-dark-700 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} className="text-white" />
                  </button>
                  <span className="px-6 text-white font-bold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="p-3 hover:bg-dark-700 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 min-w-[200px] py-4 px-6 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="p-4 bg-dark-800 border border-dark-700 text-white rounded-lg hover:border-primary-500 transition-colors">
                <Heart size={20} />
              </button>
              <button className="p-4 bg-dark-800 border border-dark-700 text-white rounded-lg hover:border-primary-500 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-dark-800/50 border border-dark-700 rounded-lg">
              <div className="flex flex-col items-center text-center">
                <Truck size={24} className="text-primary-500 mb-2" />
                <p className="text-xs text-gray-400">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield size={24} className="text-primary-500 mb-2" />
                <p className="text-xs text-gray-400">100% Authentic</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Check size={24} className="text-primary-500 mb-2" />
                <p className="text-xs text-gray-400">Lab Tested</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-dark-700">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'description'
                  ? 'bg-dark-900 text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'nutrition'
                  ? 'bg-dark-900 text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Nutrition Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-dark-900 text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'nutrition' && product.nutritionFacts && (
              <NutritionFacts facts={product.nutritionFacts} />
            )}

            {activeTab === 'reviews' && (
              <Reviews productId={product.id} reviews={product.reviews || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGallery({
  images,
  selectedImage,
  onSelectImage,
  productName,
}: any) {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]?.url || '/placeholder.png'}
          alt={productName}
          width={800}
          height={800}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image: any, index: number) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`aspect-square bg-dark-800 border rounded-lg overflow-hidden transition-all ${
                selectedImage === index
                  ? 'border-primary-500 ring-2 ring-primary-500'
                  : 'border-dark-700 hover:border-primary-500'
              }`}
            >
              <Image
                src={image.url}
                alt={`${productName} ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NutritionFacts({ facts }: any) {
  const nutrients = [
    { label: 'Calories', value: facts.calories, unit: 'kcal' },
    { label: 'Protein', value: facts.protein, unit: 'g' },
    { label: 'Carbohydrates', value: facts.carbs, unit: 'g' },
    { label: 'Fats', value: facts.fats, unit: 'g' },
    { label: 'Fiber', value: facts.fiber, unit: 'g' },
    { label: 'Sugar', value: facts.sugar, unit: 'g' },
    { label: 'Sodium', value: facts.sodium, unit: 'mg' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-dark-900 border border-dark-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Per Serving</h3>
        <div className="space-y-3">
          {nutrients.map(
            (nutrient) =>
              nutrient.value && (
                <div
                  key={nutrient.label}
                  className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0"
                >
                  <span className="text-gray-300">{nutrient.label}</span>
                  <span className="font-bold text-white">
                    {nutrient.value} {nutrient.unit}
                  </span>
                </div>
              )
          )}
        </div>
      </div>

      {facts.ingredients && (
        <div>
          <h4 className="font-bold text-white mb-2">Ingredients</h4>
          <p className="text-gray-300 text-sm">{facts.ingredients}</p>
        </div>
      )}

      {facts.allergens && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <h4 className="font-bold text-yellow-500 mb-2">Allergen Information</h4>
          <p className="text-gray-300 text-sm">{facts.allergens}</p>
        </div>
      )}
    </div>
  );
}

function Reviews({ productId, reviews }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8 text-gray-400">
        Reviews component - implement with review form and list
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-dark-900 py-8 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-dark-800 rounded-lg" />
          <div className="space-y-6">
            <div className="h-8 bg-dark-800 rounded w-3/4" />
            <div className="h-6 bg-dark-800 rounded w-1/2" />
            <div className="h-12 bg-dark-800 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <a href="/products" className="text-primary-500 hover:text-primary-400">
          ← Back to Products
        </a>
      </div>
    </div>
  );
}
