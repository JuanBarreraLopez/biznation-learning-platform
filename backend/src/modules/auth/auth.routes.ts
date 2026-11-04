import { Router, Response } from 'express';
import { login } from './auth.controller';
import { authenticate, AuthRequest } from '../../middlewares/authenticate';
import { authorize as roleGuard } from '../../middlewares/authorize';

const router = Router();

// Endpoint público
router.post('/login', login);

// Endpoint protegido (Solo con token válido)
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: 'Estás autenticado', user: req.user });
});

// Endpoint super-protegido (Solo para Administradores)
router.get('/admin-only', authenticate, roleGuard(['admin']), (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: 'Tienes acceso de administrador', user: req.user });
});

export default router;