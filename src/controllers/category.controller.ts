import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../types/api.js';
import { SuccessMessages } from '../config/constants.js';

export class CategoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.create(req.body);
      sendCreated(res, category, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.findAll();
      sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  }

  async findBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.findBySlug(req.params.slug);
      sendSuccess(res, category);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.findById(req.params.id);
      sendSuccess(res, category);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoryService.delete(req.params.id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
