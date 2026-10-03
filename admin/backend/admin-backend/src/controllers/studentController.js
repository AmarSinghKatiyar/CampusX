import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Activity from '../models/Activity.js';
import Application from '../models/Application.js';
import { withScore } from '../utils/scoring.js';

const normalizeStudentPayload = (payload = {}) => ({
  ...payload,
  rollNumber: payload.rollNumber?.toString().trim().toUpperCase(),
  name: payload.name?.toString().trim(),
  email: payload.email?.toString().trim().toLowerCase(),
  phone: payload.phone?.toString().trim() || '',
  branch: payload.branch?.toString().trim() || 'Computer Science',
  batch: payload.batch !== undefined ? Number(payload.batch) : new Date().getFullYear(),
  cgpa: payload.cgpa !== undefined ? Number(payload.cgpa) : 8.5,
  leetcode: payload.leetcode !== undefined ? Number(payload.leetcode) : 150,
  readiness: payload.readiness !== undefined ? Number(payload.readiness) : 80,
  aptitude: payload.aptitude !== undefined ? Number(payload.aptitude) : 85,
  communication: payload.communication !== undefined ? Number(payload.communication) : 80,
  projects: payload.projects !== undefined ? Number(payload.projects) : 80,
  status: payload.status?.toString().trim() || 'Eligible',
  placementStatus: payload.placementStatus?.toString().trim() || (payload.status === 'Placed' ? 'Placed' : 'Unplaced'),
  companyPlaced: payload.companyPlaced?.toString().trim() || '',
  salary: payload.salary !== undefined ? Number(payload.salary) : 0,
  profileCompletion: payload.profileCompletion !== undefined ? Number(payload.profileCompletion) : 85,
});

// POST /api/students/login
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const student = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid student credentials.' });
    }

    const isMatch = await student.matchPassword(password);
    // Allow default student password fallback for demo convenience
    if (!isMatch && password !== 'student123!' && password !== 'password123') {
      return res.status(401).json({ success: false, message: 'Invalid student credentials.' });
    }

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      success: true,
      token,
      student: withScore(student),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/students/register
export const registerStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, password } = req.body;
    if (!name || !email || !rollNumber) {
      return res.status(400).json({ success: false, message: 'Name, email, and roll number are required.' });
    }

    const existing = await Student.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { rollNumber: rollNumber.toUpperCase().trim() }],
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student with this email or roll number already registered.' });
    }

    const studentData = normalizeStudentPayload(req.body);
    if (password) studentData.password = password;
    const student = new Student(studentData);
    const saved = await student.save();

    const token = jwt.sign({ id: saved._id, role: 'student' }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    await Activity.create({
      type: 'profile',
      text: `${saved.name} registered for the student placement portal`,
      relatedStudentId: saved._id,
    });

    res.status(201).json({
      success: true,
      token,
      student: withScore(saved),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/students (supports branch, status, sort, search, minCgpa)
export const getStudents = async (req, res) => {
  try {
    const { branch, status, sort = '-createdAt', search, minCgpa } = req.query;
    const query = {};

    if (branch && branch !== 'All') query.branch = branch;
    if (status && status !== 'All') {
      const statusValue = status.toString().trim();
      const mappedStatus =
        statusValue === 'In-Progress' ? 'Eligible' :
        statusValue === 'Unplaced' ? 'Not Eligible' :
        statusValue;

      query.$or = [
        { status: mappedStatus },
        { placementStatus: statusValue },
      ];
    }

    if (minCgpa) {
      query.cgpa = { $gte: Number(minCgpa) };
    }

    if (search) {
      const searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { companyPlaced: { $regex: search, $options: 'i' } },
        ],
      };

      if (query.$or) {
        query.$and = [{ $or: query.$or }, searchQuery];
        delete query.$or;
      } else {
        query.$or = searchQuery.$or;
      }
    }

    const students = await Student.find(query).sort(sort);
    res.json(students.map(withScore));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/export/csv
export const exportStudentsCSV = async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNumber: 1 });
    const headers = [
      'Roll Number',
      'Name',
      'Email',
      'Phone',
      'Branch',
      'Batch',
      'CGPA',
      'Readiness Score',
      'LeetCode Problems',
      'Aptitude',
      'Communication',
      'Projects',
      'Placement Status',
      'Company Placed',
      'Salary (LPA)',
    ];

    const rows = students.map((s) => [
      `"${s.rollNumber || ''}"`,
      `"${s.name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.branch || ''}"`,
      s.batch || '',
      s.cgpa || 0,
      s.readiness || 0,
      s.leetcode || 0,
      s.aptitude || 0,
      s.communication || 0,
      s.projects || 0,
      `"${s.placementStatus || s.status || 'Unplaced'}"`,
      `"${s.companyPlaced || ''}"`,
      s.salary ? (s.salary / 100000).toFixed(2) : 0,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="CampusIQ_Students.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    
    // Fetch student's applications
    const applications = await Application.find({ student: student._id }).populate('placement', 'companyName jobRole ctc status');
    
    res.json({
      ...withScore(student),
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/students
export const createStudent = async (req, res) => {
  try {
    const payload = normalizeStudentPayload(req.body);

    if (!payload.rollNumber || !payload.name || !payload.email || !payload.branch) {
      return res.status(400).json({ success: false, message: 'Roll Number, Name, Email, and Branch are required.' });
    }

    const student = new Student(payload);
    const saved = await student.save();

    await Activity.create({
      type: 'profile',
      text: `${saved.name} (${saved.rollNumber}) was added to the student database`,
      relatedStudentId: saved._id,
    });

    res.status(201).json(withScore(saved));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'A student with the same roll number or email already exists.' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const previous = await Student.findById(req.params.id);
    if (!previous) return res.status(404).json({ success: false, message: 'Student not found' });

    const payload = normalizeStudentPayload(req.body);
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (payload.status === 'Placed' && previous.status !== 'Placed') {
      await Activity.create({
        type: 'placement',
        text: `${student.name} was marked as placed at ${payload.companyPlaced || 'Company'}`,
        relatedStudentId: student._id,
      });
    }

    res.json(withScore(student));
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    await Application.deleteMany({ student: student._id });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/students/:id/submit-test
export const submitStudentTest = async (req, res) => {
  try {
    const { testType, testTitle, score, questionsCount, correctCount } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const numericScore = Math.min(100, Math.max(0, Number(score) || 0));

    if (testType === 'dsa') {
      student.leetcode = Math.min(600, (student.leetcode || 150) + Math.round(numericScore / 10));
      student.projects = Math.min(100, Math.max(student.projects || 75, Math.round((student.projects || 75) * 0.7 + numericScore * 0.3)));
    } else if (testType === 'aptitude') {
      student.aptitude = Math.round((student.aptitude || 80) * 0.6 + numericScore * 0.4);
    } else if (testType === 'interview') {
      student.communication = Math.round((student.communication || 80) * 0.6 + numericScore * 0.4);
    }

    // Recalculate composite AI readiness
    student.readiness = Math.round(
      ((student.cgpa || 8) * 10) * 0.35 +
      (student.aptitude || 80) * 0.25 +
      (student.communication || 80) * 0.20 +
      Math.min(100, ((student.leetcode || 150) / 3)) * 0.20
    );

    const saved = await student.save();

    await Activity.create({
      type: 'drive',
      text: `${saved.name} completed ${testTitle || testType.toUpperCase() + ' Test'} with score ${numericScore}% (${correctCount || 0}/${questionsCount || 0} correct)`,
      relatedStudentId: saved._id,
    });

    res.json({
      success: true,
      message: 'Assessment submitted successfully',
      student: withScore(saved),
      testResult: {
        testType,
        score: numericScore,
        correctCount,
        questionsCount,
        readiness: saved.readiness,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/meta/branches
export const getBranches = async (req, res) => {
  try {
    const branches = await Student.distinct('branch');
    res.json(branches);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};