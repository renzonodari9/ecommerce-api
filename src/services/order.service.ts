import { Prisma } from '@prisma/client';
import prisma from '../utils/db.js';
import { AppError } from '../middleware/error.js';
import { HttpStatusCode, ErrorMessages } from '../config/constants.js';
import { PaginationParams } from '../types/api.js';

interface CreateOrderInput {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export class OrderService {
  async create(userId: string, input: CreateOrderInput): Promise<unknown> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', HttpStatusCode.BAD_REQUEST);
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new AppError(
          `Insufficient stock for ${item.product.name}`,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const shippingCost = subtotal > 100 ? 0 : 10;
    const taxRate = 0.21;
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;

    const orderNumber = this.generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal: new Prisma.Decimal(subtotal),
          tax: new Prisma.Decimal(tax),
          shippingCost: new Prisma.Decimal(shippingCost),
          total: new Prisma.Decimal(total),
          shippingAddress: input.shippingAddress as Prisma.InputJsonValue,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  async findAll(
    userId: string,
    pagination: PaginationParams,
    isAdmin = false
  ): Promise<unknown> {
    const where = isAdmin ? {} : { userId };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { [pagination.sortBy]: pagination.sortOrder },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page < Math.ceil(total / pagination.limit),
        hasPrevPage: pagination.page > 1,
      },
    };
  }

  async findById(userId: string, orderId: string, isAdmin = false): Promise<unknown> {
    const where = isAdmin
      ? { id: orderId }
      : { id: orderId, userId };

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError(ErrorMessages.ORDER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return order;
  }

  async updateStatus(orderId: string, status: string): Promise<unknown> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError(ErrorMessages.ORDER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updated;
  }

  async cancel(userId: string, orderId: string): Promise<unknown> {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new AppError(ErrorMessages.ORDER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new AppError(
        'Cannot cancel order that is already shipped or delivered',
        HttpStatusCode.BAD_REQUEST
      );
    }

    const cancelledOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of updated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return updated;
    });

    return cancelledOrder;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}

export const orderService = new OrderService();
