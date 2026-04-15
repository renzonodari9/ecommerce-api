import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service.js';
import { sendSuccess, sendNoContent } from '../types/api.js';

const ANONYMOUS_USER_ID = 'anonymous@anonymous.com';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers['x-user-id'] as string || ANONYMOUS_USER_ID;
      const cart = await cartService.getCart(userId);
      sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const userId = req.headers['x-user-id'] as string || ANONYMOUS_USER_ID;
      const cart = await cartService.addItem(userId, productId, quantity);
      sendSuccess(res, cart, 'Item added to cart');
    } catch (error) {
      next(error);
    }
  }

  async updateItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const userId = req.headers['x-user-id'] as string || ANONYMOUS_USER_ID;
      const cart = await cartService.updateItemQuantity(userId, productId, quantity);
      sendSuccess(res, cart, 'Cart updated');
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers['x-user-id'] as string || ANONYMOUS_USER_ID;
      const cart = await cartService.removeItem(userId, req.params.productId);
      sendSuccess(res, cart, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.headers['x-user-id'] as string || ANONYMOUS_USER_ID;
      await cartService.clearCart(userId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
