import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getBranches,
  exportStudentsCSV,
  loginStudent,
  registerStudent,
  submitStudentTest,
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public student authentication routes
router.post('/login', loginStudent);
router.post('/register', registerStudent);

// Student metadata & export
router.get('/export/csv', exportStudentsCSV);
router.get('/meta/branches', getBranches);

// Student operations (open to students & admins)
router.get('/', getStudents);
router.post('/', createStudent);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.post('/:id/submit-test', submitStudentTest);
router.delete('/:id', deleteStudent);

export default router;