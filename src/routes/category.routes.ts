import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', categoryController.findAll.bind(categoryController));
router.get('/slug/:slug', categoryController.findBySlug.bind(categoryController));
router.get('/:id', categoryController.findById.bind(categoryController));

router.post('/', authenticate, requireAdmin, categoryController.create.bind(categoryController));
router.patch('/:id', authenticate, requireAdmin, categoryController.update.bind(categoryController));
router.delete('/:id', authenticate, requireAdmin, categoryController.delete.bind(categoryController));

export default router;
