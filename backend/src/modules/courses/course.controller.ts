import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authenticate';
const db = require('../../models');
const Course = db.Course;

// Crear un nuevo curso (Solo admin)
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status } = req.body;
    const adminId = req.user?.id; // Inyectado por el middleware 'authenticate'

    if (!title) {
      res.status(400).json({ error: 'El título es obligatorio' });
      return;
    }

    const course = await Course.create({
      title,
      description,
      status: status || 'draft',
      created_by: adminId
    });

    res.status(201).json({ message: 'Curso creado', course });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los cursos
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    // Solo traemos los que no están eliminados (soft delete)
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error al listar cursos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};