// src/app/(admin)/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
} from 'lucide-react';

interface DashboardStats {
  revenue: {
    total: number;
    growth: number;
    trend: number[];
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    growth: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.revenue.total.toLocaleString('en-IN') || 0}`}
          icon={<DollarSign size={24} />}
          trend={stats?.revenue.growth || 0}
          trendLabel="vs last month"
          color="primary"
        />

        {/* Orders Card */}
        <StatCard
          title="Total Orders"
          value={stats?.orders.total || 0}
          icon={<ShoppingBag size={24} />}
          trend={stats?.orders.growth || 0}
          trendLabel="vs last month"
          color="blue"
          subtitle={`${stats?.orders.pending || 0} pending`}
        />

        {/* Customers Card */}
        <StatCard
          title="Total Customers"
          value={stats?.customers.total || 0}
          icon={<Users size={24} />}
          trend={stats?.customers.growth || 0}
          trendLabel="vs last month"
          color="green"
          subtitle={`${stats?.customers.new || 0} new this month`}
        />

        {/* Products Card */}
        <StatCard
          title="Total Products"
          value={stats?.products.total || 0}
          icon={<Package size={24} />}
          color="purple"
          subtitle={`${stats?.products.lowStock || 0} low stock`}
          warning={stats?.products.outOfStock || 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenue Overview</h3>
          {/* Chart implementation here - use recharts or chart.js */}
          <div className="h-64 flex items-center justify-center text-gray-500">
            Revenue Chart (Implement with Recharts)
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Orders Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Orders Chart (Implement with Recharts)
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <a href="/admin/orders" className="text-sm text-primary-500 hover:text-primary-400">
            View All →
          </a>
        </div>
        {/* Orders table implementation */}
        <div className="text-gray-500 text-center py-8">
          Recent orders table here
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats && stats.products.lowStock > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6"
        >
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-yellow-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-yellow-500 mb-2">Low Stock Alert</h4>
              <p className="text-gray-400 text-sm">
                {stats.products.lowStock} products are running low on stock.{' '}
                <a href="/admin/products?filter=low-stock" className="text-yellow-500 hover:underline">
                  View products
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  color: 'primary' | 'blue' | 'green' | 'purple';
  warning?: number;
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  subtitle,
  color,
  warning,
}: StatCardProps) {
  const colorClasses = {
    primary: 'from-primary-500/20 to-primary-600/20 border-primary-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  };

  const iconColorClasses = {
    primary: 'text-primary-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-6 group hover:shadow-lg transition-shadow duration-300`}
    >
      {/* Icon */}
      <div className={`absolute top-4 right-4 ${iconColorClasses[color]} opacity-20 group-hover:opacity-30 transition-opacity`}>
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        
        {trend !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              trend >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
              {Math.abs(trend)}%
            </div>
            {trendLabel && (
              <span className="text-xs text-gray-500">{trendLabel}</span>
            )}
          </div>
        )}

        {subtitle && (
          <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        )}

        {warning && warning > 0 && (
          <div className="mt-2 flex items-center gap-1 text-yellow-500 text-sm">
            <AlertCircle size={14} />
            <span>{warning} out of stock</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-dark-700 rounded w-64"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-dark-700 rounded-lg"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-80 bg-dark-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}
