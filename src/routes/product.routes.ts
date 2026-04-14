import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', productController.findAll.bind(productController));
router.get('/slug/:slug', productController.findBySlug.bind(productController));
router.get('/:id', productController.findById.bind(productController));

router.post('/', authenticate, requireAdmin, productController.create.bind(productController));
router.patch('/:id', authenticate, requireAdmin, productController.update.bind(productController));
router.delete('/:id', authenticate, requireAdmin, productController.delete.bind(productController));

export default router;
