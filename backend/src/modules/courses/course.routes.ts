import { Router } from 'express';
import { createCourse, getCourses, deleteCourse } from './course.controller'; 
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { enroll } from './enrollment.controller';

const router = Router();

router.get('/', getCourses);
router.post('/', authenticate, authorize(['admin']), createCourse);

router.delete('/:id', authenticate, authorize(['admin']), deleteCourse);

router.post('/enroll', authenticate, authorize(['student']), enroll);

export default router;