import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.findAll.bind(productController));
router.get('/slug/:slug', productController.findBySlug.bind(productController));
router.get('/:id', productController.findById.bind(productController));

router.post('/', productController.create.bind(productController));
router.patch('/:id', productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

export default router;
