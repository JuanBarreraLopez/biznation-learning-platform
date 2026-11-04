import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authenticate';
const db = require('../../models');
const LessonProgress = db.LessonProgress;
const Lesson = db.Lesson;

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const lessonId = req.params.id;

    // 1. Marcar la lección como completada (upsert para evitar duplicados)
    await LessonProgress.upsert({
      user_id: studentId,
      lesson_id: lessonId,
      status: 'completed',
      completed_at: new Date()
    });

    // 2. Calcular el porcentaje del curso
    // Primero, saber a qué curso pertenece esta lección
    const currentLesson = await Lesson.findByPk(lessonId);
    if (!currentLesson) {
      res.status(404).json({ error: 'Lección no encontrada' });
      return;
    }

    const courseId = currentLesson.course_id;

    // Contar total de lecciones del curso
    const totalLessons = await Lesson.count({ where: { course_id: courseId } });
    
    // Contar cuántas lecciones ha completado ESTE estudiante en ESTE curso
    const completedLessons = await LessonProgress.count({
      include: [{ model: Lesson, as: 'lesson', where: { course_id: courseId } }],
      where: { user_id: studentId, status: 'completed' }
    });

    // Fórmula del plan técnico
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    res.status(200).json({ 
      message: 'Progreso actualizado', 
      progressPercentage 
    });

  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};