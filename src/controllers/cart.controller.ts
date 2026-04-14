import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service.js';
import { sendSuccess, sendNoContent } from '../types/api.js';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addItem(req.user!.userId, productId, quantity);
      sendSuccess(res, cart, 'Item added to cart');
    } catch (error) {
      next(error);
    }
  }

  async updateItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.updateItemQuantity(
        req.user!.userId,
        productId,
        quantity
      );
      sendSuccess(res, cart, 'Cart updated');
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.removeItem(req.user!.userId, req.params.productId);
      sendSuccess(res, cart, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await cartService.clearCart(req.user!.userId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
