import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authenticate';

const { Op } = require('sequelize');
const db = require('../../models');
const Course = db.Course;
const Enrollment = db.Enrollment;

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
export const getCourses = async (req: Request, res: Response) => {
  try {
    // 1. Capturar paginación y búsqueda
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    // 2. Aplicar el filtro de título si el usuario escribió algo
    const whereClause = search ? { title: { [Op.iLike]: `%${search}%` } } : {}; // Usa Op.like si Op.iLike te da error

    // 3. Buscar con paginación
    const { count, rows } = await db.Course.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener cursos' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;

    // 1. Verificar que el curso exista
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ error: 'Curso no encontrado' });
      return;
    }

    // 2. Regla de Oro: Verificar si tiene estudiantes matriculados
    // En una app real cruzaríamos con la tabla Progress, pero para este MVP
    // validaremos que no se borre si ya tiene matrículas activas.
    const enrollmentsCount = await Enrollment.count({ 
      where: { course_id: courseId, status: 'active' } 
    });

    if (enrollmentsCount > 0) {
      res.status(409).json({ 
        error: 'Conflicto: No se puede eliminar un curso que tiene estudiantes matriculados.' 
      });
      return;
    }

    // 3. Ejecutar borrado lógico (Sequelize llena deletedAt automáticamente)
    await course.destroy();

    res.status(200).json({ message: 'Curso eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

