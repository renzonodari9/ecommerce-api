import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';

const router = Router();

router.get('/', orderController.findAll.bind(orderController));
router.get('/:orderId', orderController.findById.bind(orderController));
router.post('/', orderController.create.bind(orderController));
router.patch('/:orderId/cancel', orderController.cancel.bind(orderController));

router.patch('/:orderId/status', orderController.updateStatus.bind(orderController));

export default router;
