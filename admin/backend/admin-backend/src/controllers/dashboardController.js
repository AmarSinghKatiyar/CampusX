import Student from '../models/Student.js';
import Placement from '../models/Placement.js';
import Activity from '../models/Activity.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const eligibleStudents = await Student.countDocuments({ isEligible: true });
    const placedStudents = await Student.countDocuments({
      $or: [{ placementStatus: 'Placed' }, { status: 'Placed' }],
    });
    const activePlacementDrives = await Placement.countDocuments({ status: 'Active' });

    const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0;

    // Average CGPA calculation
    const avgCgpaResult = await Student.aggregate([
      { $group: { _id: null, avgCgpa: { $avg: '$cgpa' } } },
    ]);
    const averageCGPA = avgCgpaResult[0]?.avgCgpa ? Number(avgCgpaResult[0].avgCgpa.toFixed(2)) : 0;

    // Package stats
    const packageStats = await Placement.aggregate([
      { $match: { ctc: { $gt: 0 } } },
      { $group: { _id: null, maxCtc: { $max: '$ctc' }, avgCtc: { $avg: '$ctc' } } },
    ]);
    const highestPackage = packageStats[0]?.maxCtc ? Number((packageStats[0].maxCtc / 100000).toFixed(1)) : 0;
    const averagePackage = packageStats[0]?.avgCtc ? Number((packageStats[0].avgCtc / 100000).toFixed(1)) : 0;

    const companiesVisited = await Placement.distinct('companyName').then((arr) => arr.length);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        eligibleStudents,
        placedStudents,
        placementRate,
        activePlacementDrives,
        averageCGPA,
        highestPackage,
        averagePackage,
        companiesVisited,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get top students
export const getTopStudents = async (req, res) => {
  try {
    const topStudents = await Student.find()
      .sort({ cgpa: -1, readiness: -1 })
      .limit(8)
      .select('name branch cgpa placementStatus companyPlaced status readiness leetcode');

    const studentsWithBadge = topStudents.map((student, index) => {
      let badge = 'Good';
      if (student.cgpa >= 9.5) badge = 'Exceptional';
      else if (student.cgpa >= 9.0) badge = 'Outstanding';
      else if (student.cgpa >= 8.5) badge = 'Excellent';

      return {
        rank: index + 1,
        _id: student._id,
        name: student.name,
        branch: student.branch,
        cgpa: student.cgpa,
        score: Math.round(student.cgpa * 10),
        readiness: student.readiness || 80,
        leetcode: student.leetcode || 0,
        badge,
        placementStatus: student.placementStatus || student.status || 'Unplaced',
        companyPlaced: student.companyPlaced || '—',
      };
    });

    res.status(200).json({
      success: true,
      data: studentsWithBadge,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('relatedStudentId', 'name')
      .populate('relatedPlacementId', 'companyName');

    const formattedActivities = activities.map((activity) => {
      const now = new Date();
      const activityTime = new Date(activity.createdAt);
      const diffMs = now - activityTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo = `${diffMins} min ago`;
      if (diffMins < 1) timeAgo = 'Just now';
      else if (diffHours > 0 && diffHours < 24) timeAgo = `${diffHours}h ago`;
      else if (diffDays > 0) timeAgo = `${diffDays}d ago`;

      return {
        _id: activity._id,
        text: activity.text,
        time: timeAgo,
        type: activity.type,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get performance data (monthly)
export const getPerformanceData = async (req, res) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const performanceData = [];

    const now = new Date();
    const currentYear = now.getFullYear();

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentYear, i, 1);
      const monthEnd = new Date(currentYear, i + 1, 0, 23, 59, 59);

      const placementsInMonth = await Placement.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        status: 'Completed',
      });

      const studentCGPAAvg = await Student.aggregate([
        {
          $match: {
            createdAt: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: null,
            avgCGPA: { $avg: '$cgpa' },
          },
        },
      ]);

      const score = studentCGPAAvg.length > 0 ? Math.round(studentCGPAAvg[0].avgCGPA * 10) : 75 + ((i * 3) % 18);

      performanceData.push({
        month: months[i],
        score,
        placements: placementsInMonth,
      });
    }

    res.status(200).json({
      success: true,
      data: performanceData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get branch distribution
export const getBranchDistribution = async (req, res) => {
  try {
    const branches = [
      'Computer Science',
      'Electronics',
      'Mechanical',
      'Civil',
      'Electrical'
    ];
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const branchData = await Promise.all(
      branches.map(async (branch, index) => {
        const count = await Student.countDocuments({ branch });
        return {
          name: branch,
          value: count,
          color: colors[index % colors.length],
        };
      })
    );

    res.status(200).json({
      success: true,
      data: branchData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('name email rollNumber branch cgpa placementStatus companyPlaced salary status readiness');

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all placement drives
export const getAllPlacementDrives = async (req, res) => {
  try {
    const drives = await Placement.find().sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: drives,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
