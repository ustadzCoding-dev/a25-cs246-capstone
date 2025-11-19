import User from '../models/User.js';
import CapstoneGroup from '../models/CapstoneGroup.js';
import Timeline from '../models/Timeline.js';
import Document from '../models/Document.js';
import Announcement from '../models/Announcement.js';
import { updateTimelinesWithStatus } from '../utils/timelineHelper.js';

/**
 * Get dashboard statistics (Admin only)
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Hanya admin yang bisa akses dashboard stats
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Hitung total users
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });

    // Hitung total teams
    const totalTeams = await CapstoneGroup.countDocuments();
    const pendingTeams = await CapstoneGroup.countDocuments({ status: 'pending' });
    const approvedTeams = await CapstoneGroup.countDocuments({ status: 'approved' });
    const rejectedTeams = await CapstoneGroup.countDocuments({ status: 'rejected' });

    // Hitung total documents (only active documents)
    const totalDocuments = await Document.countDocuments({ isActive: true });
    const publicDocuments = await Document.countDocuments({ visibility: 'public', isActive: true });

    // Hitung total downloads dari semua dokumen
    const downloadStats = await Document.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } }
    ]);
    const totalDownloads = downloadStats[0]?.totalDownloads || 0;

    // Hitung total timelines
    const totalTimelines = await Timeline.countDocuments();
    const timelines = await Timeline.find();
    const updatedTimelines = updateTimelinesWithStatus(timelines);
    const upcomingTimelines = updatedTimelines.filter((t) => t.status === 'upcoming').length;
    const ongoingTimelines = updatedTimelines.filter((t) => t.status === 'ongoing').length;
    const completedTimelines = updatedTimelines.filter((t) => t.status === 'completed').length;
    const overdueTimelines = updatedTimelines.filter((t) => t.isOverdue === true).length;

    // Hitung total announcements
    const totalAnnouncements = await Announcement.countDocuments();
    const importantAnnouncements = await Announcement.countDocuments({ priority: 'important' });

    // Hitung learning path distribution
    const learningPathStats = await User.aggregate([
      {
        $group: {
          _id: '$learningPath',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          admins: totalAdmins,
          mentors: totalMentors
        },
        teams: {
          total: totalTeams,
          pending: pendingTeams,
          approved: approvedTeams,
          rejected: rejectedTeams
        },
        documents: {
          total: totalDocuments,
          public: publicDocuments,
          totalDownloads: totalDownloads
        },
        timelines: {
          total: totalTimelines,
          upcoming: upcomingTimelines,
          ongoing: ongoingTimelines,
          completed: completedTimelines,
          overdue: overdueTimelines
        },
        announcements: {
          total: totalAnnouncements,
          important: importantAnnouncements
        },
        learningPaths: learningPathStats
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log('Error in getDashboardStats', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Get student dashboard stats (for logged-in student)
 */
export const getStudentDashboardStats = async (req, res) => {
  try {
    // Pastikan user sudah login
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;

    // Get user's team
    const userTeam = await CapstoneGroup.findOne({ membersUserId: userId });

    // Get user's documents count
    const userDocuments = await Document.countDocuments();

    // Get timelines for user's team
    let teamTimelines = [];
    if (userTeam) {
      teamTimelines = await Timeline.find();
      teamTimelines = updateTimelinesWithStatus(teamTimelines);
    }

    // Get announcements count
    const totalAnnouncements = await Announcement.countDocuments();
    const importantAnnouncements = await Announcement.countDocuments({ priority: 'important' });

    res.status(200).json({
      success: true,
      data: {
        team: userTeam ? {
          id: userTeam._id,
          name: userTeam.teamName,
          status: userTeam.status,
          membersCount: userTeam.membersUserId.length
        } : null,
        timelines: {
          total: teamTimelines.length,
          upcoming: teamTimelines.filter((t) => t.status === 'upcoming').length,
          ongoing: teamTimelines.filter((t) => t.status === 'ongoing').length,
          completed: teamTimelines.filter((t) => t.status === 'completed').length,
          overdue: teamTimelines.filter((t) => t.isOverdue === true).length
        },
        announcements: {
          total: totalAnnouncements,
          important: importantAnnouncements
        }
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log('Error in getStudentDashboardStats', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
