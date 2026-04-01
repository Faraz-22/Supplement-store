// src/app/(user)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Award,
  TrendingUp,
  Flame,
} from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featured, newProducts] = await Promise.all([
        fetch('/api/products?isFeatured=true&limit=8').then(r => r.json()),
        fetch('/api/products?isNewArrival=true&limit=8').then(r => r.json()),
      ]);

      setFeaturedProducts(featured.data || []);
      setNewArrivals(newProducts.data || []);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-4xl font-bold text-white mb-2">
                Featured Products
              </h2>
              <p className="text-gray-400">
                Hand-picked supplements for maximum performance
              </p>
            </div>
            <Link
              href="/products?featured=true"
              className="hidden md:flex items-center gap-2 text-primary-500 hover:text-primary-400 font-semibold group"
            >
              View All
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16 bg-dark-800/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Flame size={32} className="text-primary-500" />
            <div>
              <h2 className="font-display text-4xl font-bold text-white">
                New Arrivals
              </h2>
              <p className="text-gray-400">Latest additions to our lineup</p>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-gym.jpg"
          alt="Fitness Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/50 rounded-full px-4 py-2 mb-6"
          >
            <Zap size={18} className="text-primary-500" />
            <span className="text-sm font-semibold text-primary-500">
              PREMIUM SUPPLEMENTS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-none"
          >
            FUEL YOUR
            <br />
            <span className="text-primary-500">STRENGTH</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Premium quality supplements crafted for athletes who demand
            excellence. 100% authentic products, trusted by champions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/products"
              className="group px-8 py-4 bg-primary-gradient text-white font-bold rounded-lg hover:shadow-glow-orange transition-all flex items-center gap-2"
            >
              Shop Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/deals"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              View Deals
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    {
      icon: <Shield size={32} />,
      title: '100% Authentic',
      description: 'Certified genuine products',
    },
    {
      icon: <Truck size={32} />,
      title: 'Free Shipping',
      description: 'On orders above ₹999',
    },
    {
      icon: <Award size={32} />,
      title: 'Premium Quality',
      description: 'Lab-tested supplements',
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Trusted by 50K+',
      description: 'Athletes & fitness enthusiasts',
    },
  ];

  return (
    <section className="bg-dark-800 border-y border-dark-700 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                {badge.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-400">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryShowcase() {
  const categories = [
    {
      name: 'Proteins',
      image: '/categories/protein.jpg',
      count: '50+ Products',
      href: '/products?category=protein',
    },
    {
      name: 'Pre-Workout',
      image: '/categories/preworkout.jpg',
      count: '30+ Products',
      href: '/products?category=pre-workout',
    },
    {
      name: 'Mass Gainers',
      image: '/categories/mass-gainer.jpg',
      count: '25+ Products',
      href: '/products?category=mass-gainer',
    },
    {
      name: 'Vitamins',
      image: '/categories/vitamins.jpg',
      count: '40+ Products',
      href: '/products?category=vitamins',
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-400 text-lg">
          Find the perfect supplement for your fitness goals
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={category.href}
              className="group relative block aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-300">{category.count}</p>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={24} className="text-primary-500" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    {
      title: 'Lab Tested',
      description:
        'Every product undergoes rigorous third-party testing for purity and potency.',
      stat: '100%',
    },
    {
      title: 'Fast Delivery',
      description:
        'Order today, receive tomorrow. We ship 6 days a week across India.',
      stat: '24hrs',
    },
    {
      title: 'Expert Support',
      description:
        'Our nutrition experts are here to help you choose the right supplements.',
      stat: '24/7',
    },
    {
      title: 'Satisfaction Guaranteed',
      description:
        'Not satisfied? Return within 30 days for a full refund, no questions asked.',
      stat: '30 Days',
    },
  ];

  return (
    <section className="bg-dark-900 py-16 border-y border-dark-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Why Choose FITPRO?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're committed to delivering premium quality supplements that help
            you achieve your fitness goals faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-500 transition-colors group"
            >
              <div className="text-5xl font-bold text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                {feature.stat}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section className="bg-primary-gradient py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Join the FITPRO Community
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Get exclusive deals, workout tips, and nutrition advice delivered to
            your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-dark-900 text-white font-bold rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {success && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-white font-semibold"
            >
              ✓ Successfully subscribed!
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
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
