import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({ error: 'Acceso denegado. No se encontró el rol.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes.' });
      return;
    }

    next();
  };
};