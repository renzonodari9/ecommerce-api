import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { sendSuccess, sendCreated, getPaginationParams } from '../types/api.js';
import { SuccessMessages } from '../config/constants.js';

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.create(req.user!.userId, req.body);
      sendCreated(res, order, SuccessMessages.ORDER_CREATED);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = getPaginationParams(req.query as Record<string, string>);
      const isAdmin = req.user!.role === 'ADMIN';
      const result = await orderService.findAll(req.user!.userId, pagination, isAdmin);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      const order = await orderService.findById(
        req.user!.userId,
        req.params.orderId,
        isAdmin
      );
      sendSuccess(res, order);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const order = await orderService.updateStatus(req.params.orderId, status);
      sendSuccess(res, order, SuccessMessages.ORDER_UPDATED);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.cancel(req.user!.userId, req.params.orderId);
      sendSuccess(res, order, 'Order cancelled successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
