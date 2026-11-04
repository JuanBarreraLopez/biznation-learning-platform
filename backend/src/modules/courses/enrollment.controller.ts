import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authenticate';
const db = require('../../models');
const Enrollment = db.Enrollment;

// Matricularse en un curso (Solo Estudiantes)
export const enroll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { course_id } = req.body;

    if (!course_id) {
      res.status(400).json({ error: 'El ID del curso es obligatorio' });
      return;
    }

    // El índice único en la BD evitará el doble registro, pero lo capturamos
    const [enrollment, created] = await Enrollment.findOrCreate({
      where: { user_id: studentId, course_id },
      defaults: { status: 'active' }
    });

    if (!created) {
      res.status(409).json({ error: 'Ya estás matriculado en este curso' });
      return;
    }

    res.status(201).json({ message: 'Matrícula exitosa', enrollment });
  } catch (error) {
    console.error('Error en matrícula:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};