import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';

const router = Router();

router.get('/', categoryController.findAll.bind(categoryController));
router.get('/slug/:slug', categoryController.findBySlug.bind(categoryController));
router.get('/:id', categoryController.findById.bind(categoryController));

router.post('/', categoryController.create.bind(categoryController));
router.patch('/:id', categoryController.update.bind(categoryController));
router.delete('/:id', categoryController.delete.bind(categoryController));

export default router;
