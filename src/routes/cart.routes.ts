import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', cartController.getCart.bind(cartController));
router.post('/items', cartController.addItem.bind(cartController));
router.patch('/items', cartController.updateItemQuantity.bind(cartController));
router.delete('/items/:productId', cartController.removeItem.bind(cartController));
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
