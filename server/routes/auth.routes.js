import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../utils/validation.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

export default router;