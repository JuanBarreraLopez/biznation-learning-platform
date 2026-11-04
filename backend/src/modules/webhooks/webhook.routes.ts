import { Router } from 'express';
import { receiveWebhook } from './webhook.controller';

const router = Router();

// Endpoint público para recibir eventos de sistemas externos
router.post('/', receiveWebhook);

export default router;