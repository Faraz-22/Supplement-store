// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { z } from 'zod';

// GET /api/products - List products with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const type = searchParams.get('type');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const isNewArrival = searchParams.get('isNewArrival') === 'true';
    const isBestSeller = searchParams.get('isBestSeller') === 'true';

    // Build where clause
    const where: any = {
      isActive: true,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (brand) {
      where.brand = {
        contains: brand,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isFeatured) where.isFeatured = true;
    if (isNewArrival) where.isNewArrival = true;
    if (isBestSeller) where.isBestSeller = true;

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'popularity') {
      orderBy.salesCount = 'desc';
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Fetch products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0;
      
      const { reviews, ...productData } = product;
      
      return {
        ...productData,
        averageRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: productsWithRating,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (Admin only)
const createProductSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().optional(),
  sku: z.string().min(3, 'SKU is required'),
  stock: z.number().int().min(0),
  brand: z.string().min(2, 'Brand is required'),
  type: z.enum([
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
  ]),
  categoryId: z.string(),
  weight: z.string().optional(),
  servingSize: z.string().optional(),
  servingsPerContainer: z.number().optional(),
  flavor: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
    displayOrder: z.number().default(0),
  })),
  nutritionFacts: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fats: z.number().optional(),
    fiber: z.number().optional(),
    sugar: z.number().optional(),
    sodium: z.number().optional(),
    ingredients: z.string().optional(),
    allergens: z.string().optional(),
    warnings: z.string().optional(),
  }).optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Generate slug
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create product with images and nutrition facts
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
        images: {
          create: validatedData.images,
        },
        nutritionFacts: validatedData.nutritionFacts
          ? {
              create: validatedData.nutritionFacts,
            }
          : undefined,
      },
      include: {
        images: true,
        nutritionFacts: true,
        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
