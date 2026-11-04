import { Router } from 'express';
import { createCourse, getCourses, deleteCourse } from './course.controller'; 
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { enroll } from './enrollment.controller';
import { updateProgress } from './progress.controller';

const router = Router();
const db = require('../../models');

router.get('/', getCourses);
router.post('/', authenticate, authorize(['admin']), createCourse);

router.delete('/:id', authenticate, authorize(['admin']), deleteCourse);

router.post('/enroll', authenticate, authorize(['student']), enroll);

router.patch('/lessons/:id/progress', authenticate, authorize(['student']), updateProgress);

router.post('/:id/enroll', authenticate, authorize(['student', 'admin']), async (req: any, res: any) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.role === 'admin' ? req.body.userId : req.user.id;
    
    await db.Enrollment.create({ user_id: userId, course_id: courseId });
    res.status(201).json({ success: true, message: 'Inscripción exitosa' });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'El usuario ya está inscrito en este curso' });
    }
    res.status(500).json({ success: false, error: 'Error al inscribir' });
  }
});

export default router;