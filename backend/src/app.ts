import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Biz Nation API funcionando' });
});

// Rutas de los módulos
app.use('/api/v1/auth', authRoutes);

export default app;