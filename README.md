# 🏋️ FITPRO - Premium Fitness E-Commerce Platform

A production-ready, full-stack e-commerce platform built for selling fitness supplements and gym products. Built with Next.js 14, PostgreSQL, Prisma, and Tailwind CSS.

![FITPRO Banner](./public/banner.png)

## ✨ Features

### 🛍️ **User Features**
- 🏠 Modern homepage with hero section and featured products
- 🔍 Advanced product filtering and search
- 📱 Fully responsive mobile-first design
- 🛒 Persistent shopping cart (localStorage + database)
- ❤️ Wishlist functionality
- ⭐ Product reviews and ratings
- 💳 Secure payment integration (Razorpay)
- 📦 Order tracking
- 👤 User authentication and profiles
- 🎫 Coupon/discount system

### 🔐 **Admin Features**
- 📊 Analytics dashboard with charts
- ➕ Product management (CRUD operations)
- 📦 Order management and tracking
- 👥 User management
- 🏷️ Category management
- 🎟️ Coupon creation and management
- 📸 Image upload (Cloudinary integration)
- 📈 Sales reports and analytics

### 🎨 **Design & UX**
- 🎯 Premium fitness brand aesthetics
- 🌑 Dark theme with warm orange accents
- ✨ Smooth animations (Framer Motion)
- 🎭 Loading skeletons
- 🚀 Optimized performance
- ♿ Accessibility compliant

### 🛠️ **Technical Features**
- 🔒 JWT authentication
- 🗃️ PostgreSQL database with Prisma ORM
- 📦 Redux Toolkit for state management
- 🖼️ Cloudinary for image storage
- 💰 Razorpay payment gateway
- 🔍 SEO optimized
- 📱 Mobile app ready (API-first design)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/fitness-ecommerce.git
cd fitness-ecommerce

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Initialize database
npx prisma generate
npx prisma db push
npm run db:seed

# 5. Run development server
npm run dev
```

Visit `http://localhost:3000`

**Admin Panel:** `http://localhost:3000/admin`  
**Default Login:** `admin@fitpro.com` / `Admin@123`

---

## 📁 Project Structure

```
fitness-ecommerce/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (user)/            # User-facing pages
│   │   ├── (admin)/           # Admin panel
│   │   ├── (auth)/            # Authentication pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── products/         # Product components
│   │   ├── cart/             # Cart components
│   │   └── admin/            # Admin components
│   ├── lib/                   # Core utilities
│   │   ├── prisma.ts         # Database client
│   │   ├── auth.ts           # JWT helpers
│   │   ├── cloudinary.ts     # Image upload
│   │   └── razorpay.ts       # Payment gateway
│   ├── store/                 # Redux store
│   │   └── slices/           # Redux slices
│   ├── types/                 # TypeScript types
│   └── config/                # Configuration
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── public/                    # Static assets
└── docs/                      # Documentation
```

---

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and profile data
- **Product**: Product catalog with images
- **Category**: Product categorization
- **Order**: Order management
- **OrderItem**: Individual order items
- **Cart**: Shopping cart
- **Wishlist**: Saved products
- **Review**: Product reviews
- **Coupon**: Discount codes
- **Address**: Shipping addresses

[View complete schema →](./prisma/schema.prisma)

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user
```

### Products
```
GET    /api/products           # List all products (with filters)
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product (Admin)
PUT    /api/products/:id       # Update product (Admin)
DELETE /api/products/:id       # Delete product (Admin)
GET    /api/products/search    # Search products
```

### Orders
```
GET    /api/orders             # Get user orders
POST   /api/orders             # Create order
GET    /api/orders/:id         # Get order details
PUT    /api/orders/:id/cancel  # Cancel order
```

### Cart & Wishlist
```
GET    /api/cart               # Get cart items
POST   /api/cart/add           # Add to cart
PUT    /api/cart/:id           # Update cart item
DELETE /api/cart/:id           # Remove from cart

GET    /api/wishlist           # Get wishlist
POST   /api/wishlist/add       # Add to wishlist
DELETE /api/wishlist/:id       # Remove from wishlist
```

[View complete API docs →](./docs/API.md)

---

## 🎨 Design System

### Color Palette
```css
Primary (Burnt Orange): #e8640f
Dark (Matte Black): #2d2d2d
Background: #1a1a1a
Concrete Gray: #6b7280
```

### Typography
- **Display**: Bebas Neue (Headers)
- **Body**: Inter (Content)
- **Mono**: Roboto Mono (Code)

### Components
All components follow the design system with:
- Consistent spacing (4px grid)
- Standard border radius (8px)
- Hover/active states
- Loading states
- Error states

[View complete design system →](./DESIGN_SYSTEM.md)

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Environment Variables
Required environment variables for production:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT
- `CLOUDINARY_*` - Cloudinary credentials
- `RAZORPAY_*` - Razorpay API keys
- `NEXT_PUBLIC_APP_URL` - Your domain

[Complete deployment guide →](./DEPLOYMENT_GUIDE.md)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage
npm run test:coverage
```

---

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: Optimized with code splitting

### Optimization Features
- Image optimization (Next.js Image)
- Lazy loading
- Code splitting
- Server-side rendering
- Static generation where applicable
- Efficient caching strategies

---

## 🔐 Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (React)
- ✅ Input validation (Zod)
- ✅ Secure headers
- ✅ Rate limiting (recommended)

---

## 📱 Mobile App Integration

This platform is API-first and ready for mobile app integration:

- RESTful API design
- JWT token authentication
- Consistent response format
- Mobile-optimized endpoints
- Image CDN (Cloudinary)

Build iOS/Android apps using:
- React Native
- Flutter
- Native iOS/Android

---

## 🛣️ Roadmap

### Phase 1 ✅ (Complete)
- [x] Core e-commerce functionality
- [x] Admin panel
- [x] Payment integration
- [x] User authentication

### Phase 2 🚧 (In Progress)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Product recommendations (AI)
- [ ] Review moderation

### Phase 3 📋 (Planned)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced SEO
- [ ] Social media integration
- [ ] Live chat support

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

---

## 👥 Team

- **Architecture**: Senior Full-Stack Developer
- **UI/UX**: Premium Design System
- **Backend**: Node.js + PostgreSQL
- **Frontend**: Next.js 14 + React

---

## 📞 Support

- **Documentation**: [docs/](./docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/fitness-ecommerce/issues)
- **Email**: support@fitpro.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Razorpay](https://razorpay.com/) - Payment Gateway
- [Cloudinary](https://cloudinary.com/) - Image Management

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ for the fitness community**

[Live Demo](https://fitpro-demo.vercel.app) | [Documentation](./docs) | [API Docs](./docs/API.md)
