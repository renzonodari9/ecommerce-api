import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service.js';
import { sendSuccess, sendNoContent } from '../types/api.js';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;
      const cart = await cartService.getCart(cartId);
      sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async createCart(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.createCart();
      sendSuccess(res, cart, 'Cart created');
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity, cartId } = req.body;
      let activeCartId = cartId;
      
      if (!activeCartId) {
        const newCart = await cartService.createCart();
        activeCartId = newCart.id;
      }
      
      const cart = await cartService.addItem(activeCartId, productId, quantity);
      sendSuccess(res, { ...cart as object, id: activeCartId }, 'Item added to cart');
    } catch (error) {
      next(error);
    }
  }

  async updateItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity, cartId } = req.body;
      if (!cartId) {
        throw new Error('Cart ID required');
      }
      const cart = await cartService.updateItemQuantity(cartId, productId, quantity);
      sendSuccess(res, cart, 'Cart updated');
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;
      if (!cartId) {
        throw new Error('Cart ID required');
      }
      const cart = await cartService.removeItem(cartId, req.params.productId);
      sendSuccess(res, cart, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cartId = req.headers['x-cart-id'] as string;
      if (!cartId) {
        throw new Error('Cart ID required');
      }
      await cartService.clearCart(cartId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
