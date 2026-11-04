import { Router } from 'express';
import { createCourse, getCourses } from './course.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Públicas
router.get('/', getCourses);

// Protegidas (Solo Admin)
router.post('/', authenticate, authorize(['admin']), createCourse);

export default router;