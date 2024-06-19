import { Router } from 'express';
import { AuthController } from '../controllers/auth';

const _router = Router();
_router.post('/login', AuthController.login);
_router.post('/register', AuthController.register);
// router.post('/', bookController.addBook);
// router.delete('/:id', bookController.deleteBookById);

export const router = _router;