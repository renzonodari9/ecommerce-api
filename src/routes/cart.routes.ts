import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart.bind(cartController));
router.post('/items', cartController.addItem.bind(cartController));
router.patch('/items', cartController.updateItemQuantity.bind(cartController));
router.delete('/items/:productId', cartController.removeItem.bind(cartController));
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
