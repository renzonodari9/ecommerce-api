import prisma from '../utils/db.js';
import { AppError } from '../middleware/error.js';
import { HttpStatusCode, ErrorMessages } from '../config/constants.js';

export class CartService {
  async getCart(userId: string): Promise<unknown> {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                  stock: true,
                },
              },
            },
          },
        },
      });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return {
      ...cart,
      subtotal,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<unknown> {
    const product = await prisma.product.findUnique({
      where: { id: productId, active: true },
    });

    if (!product) {
      throw new AppError(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (product.stock < quantity) {
      throw new AppError(ErrorMessages.INSUFFICIENT_STOCK, HttpStatusCode.BAD_REQUEST);
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        throw new AppError(ErrorMessages.INSUFFICIENT_STOCK, HttpStatusCode.BAD_REQUEST);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<unknown> {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          where: { productId },
        },
      },
    });

    if (!cart) {
      throw new AppError('Cart not found', HttpStatusCode.NOT_FOUND);
    }

    const item = cart.items[0];

    if (!item) {
      throw new AppError('Item not in cart', HttpStatusCode.NOT_FOUND);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (quantity > product.stock) {
      throw new AppError(ErrorMessages.INSUFFICIENT_STOCK, HttpStatusCode.BAD_REQUEST);
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<unknown> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError('Cart not found', HttpStatusCode.NOT_FOUND);
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError('Cart not found', HttpStatusCode.NOT_FOUND);
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}

export const cartService = new CartService();
