import { Router } from 'express';
import { RhymeController } from '../controllers/rhyme';

//Importing the auth middleware to secure the selected routes
import { auth } from '../middlewares/auth';


//Routes
const _router = Router();
_router.get('/', auth, RhymeController.getAll);
_router.get('/parent/:id', auth, RhymeController.getByParentId);
_router.get('/:id', RhymeController.getById);
_router.post('/', auth, RhymeController.create);
_router.post('/generated', auth, RhymeController.generate);
_router.delete('/:id', auth, RhymeController.delete);

export const router = _router;
