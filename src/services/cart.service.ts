import prisma from '../utils/db.js';
import { AppError } from '../middleware/error.js';
import { HttpStatusCode, ErrorMessages } from '../config/constants.js';

export class CartService {
  async getCart(cartId?: string): Promise<unknown> {
    if (!cartId) {
      return { items: [], subtotal: 0, itemCount: 0 };
    }
    
    let cart = await prisma.cart.findUnique({
      where: { id: cartId },
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
      return { items: [], subtotal: 0, itemCount: 0 };
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

  async createCart(): Promise<{ id: string }> {
    const cart = await prisma.cart.create({
      data: {},
    });
    return { id: cart.id };
  }

  async addItem(
    cartId: string,
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

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
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
          cartId,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(cartId);
  }

  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number
  ): Promise<unknown> {
    if (quantity <= 0) {
      return this.removeItem(cartId, productId);
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

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

    return this.getCart(cartId);
  }

  async removeItem(cartId: string, productId: string): Promise<unknown> {
    await prisma.cartItem.deleteMany({
      where: {
        cartId,
        productId,
      },
    });

    return this.getCart(cartId);
  }

  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

export const cartService = new CartService();
