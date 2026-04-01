// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { z } from 'zod';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: auth.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
        address: true,
        coupon: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
const createOrderSchema = z.object({
  addressId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  paymentMethod: z.enum(['RAZORPAY', 'COD', 'CARD', 'UPI', 'NETBANKING']),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: validatedData.addressId,
        userId: auth.userId,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Fetch products and validate stock
    const productIds = validatedData.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    if (products.length !== validatedData.items.length) {
      return NextResponse.json(
        { error: 'Some products are not available' },
        { status: 400 }
      );
    }

    // Validate stock
    for (const item of validatedData.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product?.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = validatedData.items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0]?.url || null,
        sku: product.sku,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      };
    });

    // Apply coupon if provided
    let couponDiscount = 0;
    let couponId = null;
    
    if (validatedData.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          code: validatedData.couponCode.toUpperCase(),
        },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (now >= coupon.startDate && now <= coupon.endDate) {
          if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
            if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
              couponId = coupon.id;
              
              if (coupon.type === 'PERCENTAGE') {
                couponDiscount = (subtotal * coupon.value) / 100;
                if (coupon.maxDiscount) {
                  couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
                }
              } else if (coupon.type === 'FIXED_AMOUNT') {
                couponDiscount = coupon.value;
              }
            }
          }
        }
      }
    }

    // Calculate shipping (free over ₹999)
    const shippingCost = subtotal >= 999 ? 0 : 49;
    
    // Calculate tax (18% GST)
    const tax = (subtotal - couponDiscount) * 0.18;
    
    // Total
    const total = subtotal - couponDiscount + shippingCost + tax;

    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: auth.userId,
          addressId: validatedData.addressId,
          subtotal,
          discount: couponDiscount,
          shippingCost,
          tax,
          total,
          couponId,
          couponDiscount,
          paymentMethod: validatedData.paymentMethod,
          customerNotes: validatedData.customerNotes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
          address: true,
        },
      });

      // Update product stock and sales count
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      // Update coupon usage if applied
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: {
            usedCount: { increment: 1 },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: {
          userId: auth.userId,
          productId: { in: productIds },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
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

    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
