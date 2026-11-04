import { Router } from 'express';
import { createUser, getUsers } from './user.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

router.post('/', authenticate, authorize(['admin']), createUser);
router.get('/', authenticate, authorize(['admin']), getUsers); 

export default router;