// src/components/admin/ProductForm.tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number;
  sku: string;
  stock: number;
  brand: string;
  type: string;
  categoryId: string;
  weight: string;
  servingSize: string;
  servingsPerContainer: number;
  flavor: string;
  images: File[];
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    sodium: number;
    ingredients: string;
    allergens: string;
    warnings: string;
  };
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Product',
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    compareAtPrice: 0,
    sku: '',
    stock: 0,
    brand: '',
    type: 'WHEY_PROTEIN',
    categoryId: '',
    weight: '',
    servingSize: '',
    servingsPerContainer: 0,
    flavor: '',
    images: [],
    nutritionFacts: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      ingredients: '',
      allergens: '',
      warnings: '',
    },
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    ...initialData,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productTypes = [
    'WHEY_PROTEIN',
    'MASS_GAINER',
    'PRE_WORKOUT',
    'POST_WORKOUT',
    'AMINO_ACIDS',
    'CREATINE',
    'VITAMINS',
    'FAT_BURNER',
    'ACCESSORIES',
    'OTHER',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => 
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      alert('Please select only image files');
      return;
    }

    // Create previews
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first
      const uploadedImages = [];
      for (const image of formData.images) {
        const formData = new FormData();
        formData.append('file', image);

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedImages.push({
            url: data.url,
            altText: '',
            isPrimary: uploadedImages.length === 0,
            displayOrder: uploadedImages.length,
          });
        }
      }

      // Submit product data
      await onSubmit({
        ...formData,
        images: uploadedImages as any,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              placeholder="e.g., Whey Protein Isolate"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Description
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              placeholder="Brief product description"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Description *
            </label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              placeholder="Detailed product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand *
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            >
              {productTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SKU *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              placeholder="SKU-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Flavor
            </label>
            <input
              type="text"
              value={formData.flavor}
              onChange={(e) => setFormData(prev => ({ ...prev, flavor: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              placeholder="Chocolate, Vanilla, etc."
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6">Pricing & Inventory</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Compare at Price (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: parseFloat(e.target.value) }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6">Product Images</h3>
        
        <div className="space-y-4">
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full aspect-square object-cover rounded-lg border border-dark-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs font-bold rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 border-2 border-dashed border-dark-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-500 transition-colors"
          >
            <Upload size={24} className="text-gray-500" />
            <span className="text-sm text-gray-500">Click to upload images</span>
          </button>
        </div>
      </div>

      {/* Flags */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6">Product Flags</h3>
        
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-300">Featured Product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNewArrival}
              onChange={(e) => setFormData(prev => ({ ...prev, isNewArrival: e.target.checked }))}
              className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-300">New Arrival</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
              className="w-5 h-5 rounded border-dark-600 bg-dark-900 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-300">Best Seller</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
