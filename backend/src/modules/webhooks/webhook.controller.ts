import { Request, Response } from 'express';
const db = require('../../models');
const WebhookEvent = db.WebhookEvent;

export const receiveWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id, source, type, payload } = req.body;

    if (!event_id || !source || !type || !payload) {
      res.status(400).json({ error: 'Faltan campos obligatorios en el webhook' });
      return;
    }

    // 1. Verificación de Idempotencia (Evitar duplicados)
    const existingEvent = await WebhookEvent.findOne({ where: { event_id } });
    
    if (existingEvent) {
      console.log(`[Webhook] Evento duplicado ignorado: ${event_id}`);
      // Siempre respondemos 200 OK al proveedor para que deje de reintentar
      res.status(200).json({ message: 'Evento ya fue procesado previamente' });
      return;
    }

    // 2. Guardar el evento en estado "pending"
    const newEvent = await WebhookEvent.create({
      event_id,
      source,
      type,
      payload, // Sequelize lo guarda automáticamente como JSONB
      status: 'pending'
    });

    // 3. Simular el procesamiento asíncrono...
    // Aquí es donde en la vida real enviaríamos un correo, activaríamos un curso, etc.
    console.log(`[Webhook] Procesando evento ${type} desde ${source}...`);
    
    // Marcar como procesado
    newEvent.status = 'processed';
    newEvent.processed_at = new Date();
    await newEvent.save();

    // 4. Responder éxito al proveedor externo
    res.status(200).json({ message: 'Webhook recibido y procesado correctamente' });
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    // Un 500 le dirá al sistema externo que debe reintentar enviar el webhook luego
    res.status(500).json({ error: 'Error interno procesando el webhook' });
  }
};