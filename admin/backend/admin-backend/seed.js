import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';
import Student from './src/models/Student.js';
import Placement from './src/models/Placement.js';
import Application from './src/models/Application.js';
import Activity from './src/models/Activity.js';
import Admin from './src/models/Admin.js';
import connectDB from './src/config/db.js';

// Fix Node.js DNS SRV lookup on Windows networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      throw new Error('Database connection failed during seeding');
    }

    console.log('🧹 Clearing existing collections...');
    await Student.deleteMany({});
    await Placement.deleteMany({});
    await Application.deleteMany({});
    await Activity.deleteMany({});
    await Admin.deleteMany({});

    console.log('🎓 Creating sample students...');
    const students = await Student.insertMany([
      {
        name: "Priya Sharma",
        email: "priya.sharma@university.edu",
        rollNumber: "CS001",
        phone: "+91 9876543210",
        branch: "Computer Science",
        cgpa: 9.8,
        batch: 2025,
        leetcode: 320,
        readiness: 95,
        aptitude: 92,
        communication: 90,
        projects: 95,
        status: "Placed",
        isEligible: true,
        placementStatus: "Placed",
        companyPlaced: "Google",
        salary: 2400000,
        profileCompletion: 100
      },
      {
        name: "Arjun Mehta",
        email: "arjun.mehta@university.edu",
        rollNumber: "EC001",
        phone: "+91 9876543211",
        branch: "Electronics",
        cgpa: 9.6,
        batch: 2025,
        leetcode: 280,
        readiness: 90,
        aptitude: 88,
        communication: 85,
        projects: 90,
        status: "Placed",
        isEligible: true,
        placementStatus: "Placed",
        companyPlaced: "Microsoft",
        salary: 2200000,
        profileCompletion: 95
      },
      {
        name: "Sneha Iyer",
        email: "sneha.iyer@university.edu",
        rollNumber: "CS002",
        phone: "+91 9876543212",
        branch: "Computer Science",
        cgpa: 9.5,
        batch: 2025,
        leetcode: 250,
        readiness: 85,
        aptitude: 86,
        communication: 88,
        projects: 85,
        status: "Eligible",
        isEligible: true,
        placementStatus: "In-Progress",
        profileCompletion: 85
      },
      {
        name: "Rahul Verma",
        email: "rahul.verma@university.edu",
        rollNumber: "ME001",
        phone: "+91 9876543213",
        branch: "Mechanical",
        cgpa: 9.3,
        batch: 2025,
        leetcode: 110,
        readiness: 80,
        aptitude: 82,
        communication: 80,
        projects: 88,
        status: "Placed",
        isEligible: true,
        placementStatus: "Placed",
        companyPlaced: "Infosys",
        salary: 1800000,
        profileCompletion: 80
      },
      {
        name: "Kavya Nair",
        email: "kavya.nair@university.edu",
        rollNumber: "CS003",
        phone: "+91 9876543214",
        branch: "Computer Science",
        cgpa: 9.2,
        batch: 2025,
        leetcode: 190,
        readiness: 75,
        aptitude: 80,
        communication: 85,
        projects: 78,
        status: "Not Eligible",
        isEligible: false,
        placementStatus: "Unplaced",
        profileCompletion: 70
      },
      {
        name: "Dev Patel",
        email: "dev.patel@university.edu",
        rollNumber: "CV001",
        phone: "+91 9876543215",
        branch: "Civil",
        cgpa: 9.1,
        batch: 2025,
        leetcode: 80,
        readiness: 88,
        aptitude: 85,
        communication: 82,
        projects: 85,
        status: "Placed",
        isEligible: true,
        placementStatus: "Placed",
        companyPlaced: "TCS",
        salary: 1600000,
        profileCompletion: 90
      },
      {
        name: "Ananya Singh",
        email: "ananya.singh@university.edu",
        rollNumber: "CS004",
        phone: "+91 9876543216",
        branch: "Computer Science",
        cgpa: 9.0,
        batch: 2025,
        leetcode: 220,
        readiness: 82,
        aptitude: 84,
        communication: 86,
        projects: 80,
        status: "Eligible",
        isEligible: true,
        placementStatus: "In-Progress",
        profileCompletion: 75
      },
      {
        name: "Karan Joshi",
        email: "karan.joshi@university.edu",
        rollNumber: "EC002",
        phone: "+91 9876543217",
        branch: "Electronics",
        cgpa: 8.9,
        batch: 2025,
        leetcode: 175,
        readiness: 84,
        aptitude: 81,
        communication: 83,
        projects: 82,
        status: "Placed",
        isEligible: true,
        placementStatus: "Placed",
        companyPlaced: "Wipro",
        salary: 1700000,
        profileCompletion: 85
      },
    ]);

    console.log('🏢 Creating sample placement drives...');
    const placements = await Placement.insertMany([
      {
        companyName: "Google",
        ctc: 2400000,
        jobRole: "Software Engineer",
        registeredStudents: 45,
        selectedStudents: 3,
        status: "Completed",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-12-10"),
        eligibilityCriteria: { minCGPA: 8.0, branchesAllowed: ["Computer Science", "Electronics"] }
      },
      {
        companyName: "Microsoft",
        ctc: 2200000,
        jobRole: "Software Developer",
        registeredStudents: 38,
        selectedStudents: 2,
        status: "Completed",
        startDate: new Date("2024-12-05"),
        endDate: new Date("2024-12-12"),
        eligibilityCriteria: { minCGPA: 8.5, branchesAllowed: ["Computer Science"] }
      },
      {
        companyName: "TCS",
        ctc: 1600000,
        jobRole: "Systems Engineer",
        registeredStudents: 120,
        selectedStudents: 15,
        status: "Active",
        startDate: new Date("2024-12-15"),
        eligibilityCriteria: { minCGPA: 7.0, branchesAllowed: ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"] }
      },
      {
        companyName: "Infosys",
        ctc: 1800000,
        jobRole: "Software Engineer",
        registeredStudents: 95,
        selectedStudents: 12,
        status: "Active",
        startDate: new Date("2024-12-18"),
        eligibilityCriteria: { minCGPA: 7.5, branchesAllowed: ["Computer Science", "Electronics"] }
      },
    ]);

    console.log('📝 Creating applications...');
    await Application.insertMany([
      { placement: placements[0]._id, student: students[0]._id, stage: 'Placed' },
      { placement: placements[1]._id, student: students[1]._id, stage: 'Placed' },
      { placement: placements[2]._id, student: students[2]._id, stage: 'Shortlisted' },
      { placement: placements[3]._id, student: students[6]._id, stage: 'Interview' },
    ]);

    console.log('⚡ Creating activity feed...');
    await Activity.insertMany([
      { type: "profile", text: "Priya Sharma completed profile update", relatedStudentId: students[0]._id },
      { type: "drive", text: "TCS recruitment drive registered — 45 students applied", relatedPlacementId: placements[2]._id },
      { type: "placement", text: "Arjun Mehta selected in Microsoft drive", relatedStudentId: students[1]._id, relatedPlacementId: placements[1]._id },
      { type: "other", text: "New students registered via student portal" },
      { type: "drive", text: "Infosys interview round scheduled", relatedPlacementId: placements[3]._id },
      { type: "profile", text: "Sneha Iyer updated resume in profile" },
    ]);

    console.log('👤 Creating initial admin account...');
    await Admin.create({
      name: "Admin User",
      email: "admin@campusiq.edu",
      password: "adminPassword123!",
      role: "admin",
      jobTitle: "Lead Placement Officer",
      phone: "+91 9876543200",
      institution: {
        name: "Campus IQ Institute of Technology",
        code: "CIQ-2025",
        address: "Campus IQ Blvd",
        website: "https://campusiq.edu",
      }
    });

    console.log('✅ Seed data successfully populated in MongoDB Atlas!');
    console.log(`📊 Summary: ${students.length} students, ${placements.length} drives, 1 admin (admin@campusiq.edu)`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
