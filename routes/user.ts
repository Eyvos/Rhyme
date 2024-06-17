import { Router } from 'express';
import { UserController } from '../controllers/user';

//Importing the auth middleware to secure the selected routes
import { auth } from '../middlewares/auth';
import { authAdmin } from '../middlewares/authAdmin';

const _router = Router();

_router.get('/', auth, UserController.getAll);
_router.get('/:id', UserController.getOne);
_router.put('/', auth, UserController.changeUsername);
_router.put('/password', auth, UserController.changePassword);
_router.delete('/:id', authAdmin, UserController.deleteUserAdmin);
_router.delete('/', auth, UserController.deleteUser);

export const router = _router;