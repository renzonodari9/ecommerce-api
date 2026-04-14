import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';
import { sendSuccess, sendCreated, sendNoContent, getPaginationParams } from '../types/api.js';
import { SuccessMessages } from '../config/constants.js';

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      sendCreated(res, product, SuccessMessages.PRODUCT_CREATED);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = getPaginationParams(req.query as Record<string, string>);
      const filters = {
        categoryId: req.query.categoryId as string,
        featured: req.query.featured === 'true' ? true : undefined,
        active: req.query.active === 'false' ? false : true,
        search: req.query.search as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      };

      const result = await productService.findAll(filters, pagination);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.findBySlug(req.params.slug);
      sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.findById(req.params.id);
      sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.update(req.params.id, req.body);
      sendSuccess(res, product, SuccessMessages.PRODUCT_UPDATED);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(req.params.id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
