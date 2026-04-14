import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validation.js';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../types/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register.bind(authController));
router.post('/login', validateBody(loginSchema), authController.login.bind(authController));
router.get('/profile', authenticate, authController.getProfile.bind(authController));
router.patch('/profile', authenticate, validateBody(updateProfileSchema), authController.updateProfile.bind(authController));
router.post('/change-password', authenticate, validateBody(changePasswordSchema), authController.changePassword.bind(authController));

export default router;
