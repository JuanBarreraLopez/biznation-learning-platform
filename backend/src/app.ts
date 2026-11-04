import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes';
import courseRoutes from './modules/courses/course.routes';
import webhookRoutes from './modules/webhooks/webhook.routes'; 
import { runClassificationJob } from './jobs/classifyStudents';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Biz Nation API funcionando' });
});

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// 3. Endpoint oculto para disparar el Cron Job manualmente (Solo para la prueba técnica)
app.post('/api/v1/jobs/trigger-classification', async (req, res) => {
  // Ejecutamos la tarea en segundo plano sin bloquear la respuesta
  runClassificationJob();
  res.status(202).json({ message: 'Job de clasificación disparado en segundo plano' });
});

export default app;