import Worksheet from '../models/Worksheet.js';
import WorksheetPeriod from '../models/WorksheetPeriod.js';
import User from '../models/User.js';
import EmailServiceModule from './EmailService.js';
import logger from '../utils/logger.js';
import { deleteWorksheetEvidence } from './CloudinaryService.js';

class WorksheetService {
  constructor() {
    this.emailService = EmailServiceModule.getInstance();
  }

  // ==================== PERIOD MANAGEMENT ====================

  /**
   * Create a new worksheet period
   * @param {Object} periodData - Period data
   * @param {string} adminId - Admin user ID who creates the period
   */
  async createPeriod(periodData, adminId) {
    try {
      const { periodNumber, title, description, startDate, deadline, autoValidationDate } =
        periodData;

      // Check if period number already exists
      const existingPeriod = await WorksheetPeriod.findOne({ periodNumber });
      if (existingPeriod) {
        throw new Error(`Period number ${periodNumber} already exists`);
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(deadline);
      const autoValidate = new Date(autoValidationDate);

      if (start >= end) {
        throw new Error('Start date must be before deadline');
      }

      if (autoValidate < end) {
        throw new Error('Auto validation date must be after or equal to deadline');
      }

      const period = await WorksheetPeriod.create({
        periodNumber,
        title,
        description,
        startDate: start,
        deadline: end,
        autoValidationDate: autoValidate,
        status: 'draft',
        createdBy: adminId
      });

      logger.info(`[WorksheetService] Period ${periodNumber} created by admin ${adminId}`);
      return period;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to create period: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a worksheet period
   * @param {string} periodId - Period ID
   * @param {Object} updateData - Update data
   */
  async updatePeriod(periodId, updateData) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      // Don't allow updating validated periods
      if (period.status === 'validated') {
        throw new Error('Cannot update a validated period');
      }

      const allowedUpdates = [
        'title',
        'description',
        'startDate',
        'deadline',
        'autoValidationDate',
        'status',
        'reminderSettings'
      ];

      allowedUpdates.forEach((field) => {
        if (updateData[field] !== undefined) {
          period[field] = updateData[field];
        }
      });

      await period.save();
      logger.info(`[WorksheetService] Period ${periodId} updated`);
      return period;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to update period: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a worksheet period
   * @param {string} periodId - Period ID
   */
  async deletePeriod(periodId) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      // Check if there are any worksheets submitted for this period
      const worksheetCount = await Worksheet.countDocuments({ periodId });
      if (worksheetCount > 0) {
        throw new Error(
          `Cannot delete period with ${worksheetCount} submitted worksheets. Delete worksheets first.`
        );
      }

      await WorksheetPeriod.findByIdAndDelete(periodId);
      logger.info(`[WorksheetService] Period ${periodId} deleted`);
      return { success: true, message: 'Period deleted successfully' };
    } catch (error) {
      logger.error(`[WorksheetService] Failed to delete period: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all periods
   */
  async getAllPeriods() {
    try {
      const periods = await WorksheetPeriod.findAllSorted();
      return periods;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to get periods: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get period by ID
   * @param {string} periodId - Period ID
   */
  async getPeriodById(periodId) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }
      return period;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to get period: ${error.message}`);
      throw error;
    }
  }

  /**
   * Activate a period
   * @param {string} periodId - Period ID
   */
  async activatePeriod(periodId) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      if (period.status !== 'draft') {
        throw new Error('Only draft periods can be activated');
      }

      await period.activate();
      logger.info(`[WorksheetService] Period ${periodId} activated`);
      return period;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to activate period: ${error.message}`);
      throw error;
    }
  }

  /**
   * Close a period
   * @param {string} periodId - Period ID
   */
  async closePeriod(periodId) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      if (period.status !== 'active') {
        throw new Error('Only active periods can be closed');
      }

      await period.close();
      logger.info(`[WorksheetService] Period ${periodId} closed`);
      return period;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to close period: ${error.message}`);
      throw error;
    }
  }

  // ==================== WORKSHEET MANAGEMENT ====================

  /**
   * Create or update worksheet (draft)
   * @param {string} userId - User ID
   * @param {string} periodId - Period ID
   * @param {Object} worksheetData - Worksheet data
   */
  async saveWorksheetDraft(userId, periodId, worksheetData) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      if (period.status !== 'active') {
        throw new Error('Cannot submit worksheet for inactive period');
      }

      // Find existing worksheet or create new one
      let worksheet = await Worksheet.findOne({ userId, periodId });

      if (worksheet && worksheet.isSubmitted) {
        throw new Error('Worksheet already submitted and cannot be modified');
      }

      if (!worksheet) {
        worksheet = new Worksheet({
          userId,
          periodId,
          activityDescription: worksheetData.activityDescription,
          evidence: worksheetData.evidence || []
        });
      } else {
        worksheet.activityDescription = worksheetData.activityDescription;
        if (worksheetData.evidence) {
          worksheet.evidence = worksheetData.evidence;
        }
      }

      await worksheet.save();
      logger.info(
        `[WorksheetService] Worksheet draft saved for user ${userId}, period ${periodId}`
      );
      return worksheet;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to save worksheet draft: ${error.message}`);
      throw error;
    }
  }

  /**
   * Submit worksheet
   * @param {string} userId - User ID
   * @param {string} periodId - Period ID
   * @param {Object} worksheetData - Worksheet data (optional, for final update before submit)
   */
  async submitWorksheet(userId, periodId, worksheetData = null) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      // Allow submission even after deadline (will be marked as late)
      if (period.status === 'validated') {
        throw new Error('Period has been validated. Cannot submit worksheet.');
      }

      let worksheet = await Worksheet.findOne({ userId, periodId });

      if (worksheet && worksheet.isSubmitted) {
        throw new Error('Worksheet already submitted');
      }

      if (!worksheet) {
        if (!worksheetData || !worksheetData.activityDescription) {
          throw new Error('Activity description is required');
        }
        worksheet = new Worksheet({
          userId,
          periodId,
          activityDescription: worksheetData.activityDescription,
          evidence: worksheetData.evidence || []
        });
      } else if (worksheetData) {
        // Update with final data before submitting
        if (worksheetData.activityDescription) {
          worksheet.activityDescription = worksheetData.activityDescription;
        }
        if (worksheetData.evidence) {
          worksheet.evidence = worksheetData.evidence;
        }
      }

      // Validate minimum requirements
      if (!worksheet.activityDescription || worksheet.activityDescription.length < 50) {
        throw new Error('Activity description must be at least 50 characters');
      }

      // Submit the worksheet
      await worksheet.submit(period.deadline);

      logger.info(`[WorksheetService] Worksheet submitted for user ${userId}, period ${periodId}`);
      return worksheet;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to submit worksheet: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add evidence to worksheet
   * @param {string} userId - User ID
   * @param {string} periodId - Period ID
   * @param {Array} evidenceFiles - Array of file info objects
   */
  async addEvidence(userId, periodId, evidenceFiles) {
    try {
      let worksheet = await Worksheet.findOne({ userId, periodId });

      if (worksheet && worksheet.isSubmitted) {
        throw new Error('Cannot add evidence to submitted worksheet');
      }

      if (!worksheet) {
        worksheet = new Worksheet({
          userId,
          periodId,
          activityDescription: '', // Will be filled later
          evidence: evidenceFiles
        });
      } else {
        // Append new evidence
        worksheet.evidence = [...worksheet.evidence, ...evidenceFiles];
      }

      // Check maximum evidence limit
      if (worksheet.evidence.length > 5) {
        throw new Error('Maximum 5 evidence files allowed');
      }

      await worksheet.save();
      logger.info(
        `[WorksheetService] Evidence added for user ${userId}, period ${periodId}. Total: ${worksheet.evidence.length}`
      );
      return worksheet;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to add evidence: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove evidence from worksheet
   * @param {string} userId - User ID
   * @param {string} periodId - Period ID
   * @param {string} evidenceId - Evidence ID to remove
   */
  async removeEvidence(userId, periodId, evidenceId) {
    try {
      const worksheet = await Worksheet.findOne({ userId, periodId });

      if (!worksheet) {
        throw new Error('Worksheet not found');
      }

      if (worksheet.isSubmitted) {
        throw new Error('Cannot remove evidence from submitted worksheet');
      }

      const evidenceIndex = worksheet.evidence.findIndex(
        (e) =>
          e._id.toString() === evidenceId || e.fileName === evidenceId || e.publicId === evidenceId
      );

      if (evidenceIndex === -1) {
        throw new Error('Evidence not found');
      }

      // Delete the file from Cloudinary
      const evidence = worksheet.evidence[evidenceIndex];
      if (evidence.publicId) {
        try {
          await deleteWorksheetEvidence(evidence.publicId, evidence.resourceType || 'image');
        } catch (deleteError) {
          logger.warn(
            `[WorksheetService] Failed to delete from Cloudinary: ${deleteError.message}`
          );
        }
      }

      // Remove from array
      worksheet.evidence.splice(evidenceIndex, 1);
      await worksheet.save();

      logger.info(`[WorksheetService] Evidence ${evidenceId} removed from worksheet`);
      return worksheet;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to remove evidence: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get worksheet by user and period
   * @param {string} userId - User ID
   * @param {string} periodId - Period ID
   */
  async getWorksheet(userId, periodId) {
    try {
      const worksheet = await Worksheet.findOne({ userId, periodId })
        .populate('userId', 'name email dicodingId')
        .populate('periodId', 'periodNumber title startDate deadline status');

      return worksheet;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to get worksheet: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all worksheets for a user
   * @param {string} userId - User ID
   */
  async getUserWorksheets(userId) {
    try {
      logger.info(`[WorksheetService] Getting worksheets for user: ${userId}`);

      if (!userId) {
        throw new Error('User ID is required');
      }

      const worksheets = await Worksheet.findByUser(userId);
      logger.info(`[WorksheetService] Found ${worksheets.length} worksheets for user`);

      const periods = await WorksheetPeriod.findAllSorted();
      logger.info(`[WorksheetService] Found ${periods.length} periods`);

      // Map worksheets to periods
      const result = periods.map((period) => {
        const worksheet = worksheets.find(
          (w) => w.periodId && w.periodId._id && w.periodId._id.toString() === period._id.toString()
        );
        return {
          period: {
            id: period._id,
            periodNumber: period.periodNumber,
            title: period.title,
            startDate: period.startDate,
            deadline: period.deadline,
            status: period.status,
            statusLabel: period.statusLabel,
            isCurrentlyActive: period.isCurrentlyActive,
            daysRemaining: period.daysRemaining
          },
          worksheet: worksheet
            ? {
              id: worksheet._id,
              activityDescription: worksheet.activityDescription || '',
              evidence: worksheet.evidence || [],
              evidenceCount: worksheet.evidence ? worksheet.evidence.length : 0,
              isSubmitted: worksheet.isSubmitted || false,
              submittedAt: worksheet.submittedAt,
              isLate: worksheet.isLate || false,
              validationStatus: worksheet.validationStatus || 'pending',
              validationStatusLabel: worksheet.validationStatusLabel || 'Menunggu Validasi',
              adminNotes: worksheet.adminNotes || null
            }
            : null
        };
      });

      logger.info(`[WorksheetService] Returning ${result.length} worksheet entries`);
      return result;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to get user worksheets: ${error.message}`);
      logger.error(`[WorksheetService] Stack: ${error.stack}`);
      throw error;
    }
  }

  // ==================== VALIDATION ====================

  /**
   * Validate a single worksheet (manual validation by admin)
   * @param {string} worksheetId - Worksheet ID
   * @param {string} adminId - Admin user ID
   * @param {string} status - Validation status
   * @param {string} notes - Admin notes (optional)
   */
  async validateWorksheet(worksheetId, adminId, status, notes = null) {
    try {
      const worksheet = await Worksheet.findById(worksheetId);
      if (!worksheet) {
        throw new Error('Worksheet not found');
      }

      const validStatuses = ['completed', 'completed_late', 'incomplete'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      await worksheet.setValidation(adminId, status, notes);

      logger.info(
        `[WorksheetService] Worksheet ${worksheetId} validated as ${status} by admin ${adminId}`
      );
      return worksheet;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to validate worksheet: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reject a worksheet - student can resubmit
   * @param {string} worksheetId - Worksheet ID
   * @param {string} adminId - Admin user ID
   * @param {string} reason - Rejection reason
   */
  async rejectWorksheet(worksheetId, adminId, reason) {
    try {
      const worksheet = await Worksheet.findById(worksheetId);
      if (!worksheet) {
        throw new Error('Worksheet not found');
      }

      if (worksheet.validationStatus !== 'pending') {
        throw new Error('Only pending worksheets can be rejected');
      }

      await worksheet.reject(adminId, reason);

      logger.info(
        `[WorksheetService] Worksheet ${worksheetId} rejected by admin ${adminId}. Reason: ${reason}`
      );
      return worksheet;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to reject worksheet: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run automatic validation for a period
   * @param {string} periodId - Period ID
   * @param {string} adminId - Admin user ID (system or manual trigger)
   */
  async runAutoValidation(periodId, adminId = null) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      if (period.status === 'validated') {
        throw new Error('Period already validated');
      }

      // Get all students
      const students = await User.find({ role: 'student' }).select('_id');
      const studentIds = students.map((s) => s._id);

      // Get all worksheets for this period
      const worksheets = await Worksheet.find({ periodId });
      const submittedUserIds = new Set(worksheets.map((w) => w.userId.toString()));

      const validationResults = {
        completed: 0,
        completed_late: 0,
        incomplete: 0,
        total: studentIds.length
      };

      // Process submitted worksheets
      for (const worksheet of worksheets) {
        if (worksheet.validationStatus === 'pending') {
          let status;

          if (worksheet.isSubmitted) {
            // Check if has activity description and evidence
            const hasValidContent =
              worksheet.activityDescription && worksheet.activityDescription.length >= 50;

            if (hasValidContent) {
              status = worksheet.isLate ? 'completed_late' : 'completed';
            } else {
              status = 'incomplete';
            }
          } else {
            status = 'incomplete';
          }

          await worksheet.setValidation(adminId, status, 'Auto-validated by system');
          validationResults[status]++;
        }
      }

      // Create "incomplete" worksheets for students who didn't submit
      for (const studentId of studentIds) {
        if (!submittedUserIds.has(studentId.toString())) {
          await Worksheet.create({
            userId: studentId,
            periodId,
            activityDescription: '',
            evidence: [],
            isSubmitted: false,
            validationStatus: 'incomplete',
            validatedBy: adminId,
            validatedAt: new Date(),
            adminNotes: 'Auto-validated: No submission'
          });
          validationResults.incomplete++;
        }
      }

      // Mark period as validated
      await period.markAsValidated();

      logger.info(
        `[WorksheetService] Auto-validation completed for period ${periodId}. Results: ${JSON.stringify(validationResults)}`
      );
      return validationResults;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to run auto-validation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get worksheets for a period (admin view)
   * @param {string} periodId - Period ID
   * @param {Object} filters - Optional filters
   */
  async getWorksheetsByPeriod(periodId, filters = {}) {
    try {
      const query = { periodId };

      if (filters.validationStatus) {
        query.validationStatus = filters.validationStatus;
      }

      if (filters.isSubmitted !== undefined) {
        query.isSubmitted = filters.isSubmitted;
      }

      const worksheets = await Worksheet.find(query)
        .populate('userId', 'name email dicodingId learningPathName university')
        .populate('validatedBy', 'name email')
        .sort({ submittedAt: -1 });

      return worksheets;
    } catch (error) {
      logger.error(`[WorksheetService] Failed to get worksheets by period: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get validation statistics for a period
   * @param {string} periodId - Period ID
   */
  async getValidationStats(periodId) {
    try {
      const stats = await Worksheet.getStatsByPeriod(periodId);
      const period = await WorksheetPeriod.findById(periodId);

      // Get total students
      const totalStudents = await User.countDocuments({ role: 'student' });

      return {
        period: {
          id: period._id,
          periodNumber: period.periodNumber,
          title: period.title,
          status: period.status
        },
        stats: {
          ...stats,
          totalStudents,
          submissionRate: totalStudents > 0 ? ((stats.total / totalStudents) * 100).toFixed(2) : 0,
          completionRate:
            stats.total > 0
              ? (((stats.completed + stats.completed_late) / stats.total) * 100).toFixed(2)
              : 0
        }
      };
    } catch (error) {
      logger.error(`[WorksheetService] Failed to get validation stats: ${error.message}`);
      throw error;
    }
  }

  // ==================== EXPORT ====================

  /**
   * Export worksheet data to JSON (for spreadsheet conversion)
   * @param {string} periodId - Period ID
   */
  async exportWorksheetData(periodId) {
    try {
      const worksheets = await Worksheet.find({ periodId })
        .populate('userId', 'name email dicodingId learningPathName university')
        .populate('validatedBy', 'name email')
        .sort({ 'userId.name': 1 });

      const period = await WorksheetPeriod.findById(periodId);

      const exportData = worksheets.map((w, index) => ({
        no: index + 1,
        dicoding_id: w.userId?.dicodingId || '-',
        name: w.userId?.name || '-',
        email: w.userId?.email || '-',
        learning_path: w.userId?.learningPathName || '-',
        university: w.userId?.university || '-',
        submitted: w.isSubmitted ? 'Ya' : 'Tidak',
        submitted_at: w.submittedAt ? w.submittedAt.toISOString() : '-',
        is_late: w.isLate ? 'Ya' : 'Tidak',
        evidence_count: w.evidenceCount || 0,
        validation_status: w.validationStatusLabel,
        admin_notes: w.adminNotes || '-',
        validated_by: w.validatedBy?.name || '-',
        validated_at: w.validatedAt ? w.validatedAt.toISOString() : '-'
      }));

      return {
        period: {
          periodNumber: period.periodNumber,
          title: period.title,
          startDate: period.startDate,
          deadline: period.deadline
        },
        data: exportData,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`[WorksheetService] Failed to export worksheet data: ${error.message}`);
      throw error;
    }
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Send reminder notifications to students who haven't submitted
   * @param {string} periodId - Period ID
   */
  async sendReminderNotifications(periodId) {
    try {
      const period = await WorksheetPeriod.findById(periodId);
      if (!period) {
        throw new Error('Period not found');
      }

      if (period.status !== 'active') {
        throw new Error('Can only send reminders for active periods');
      }

      // Get all students
      const students = await User.find({ role: 'student' }).select('_id email name');

      // Get students who have already submitted
      const submittedWorksheets = await Worksheet.find({
        periodId,
        isSubmitted: true
      }).select('userId');
      const submittedUserIds = new Set(submittedWorksheets.map((w) => w.userId.toString()));

      // Filter students who haven't submitted
      const pendingStudents = students.filter((s) => !submittedUserIds.has(s._id.toString()));

      let sentCount = 0;
      const errors = [];

      // Send email to each pending student
      for (const student of pendingStudents) {
        try {
          await this.emailService.sendWorksheetReminderEmail({
            recipientEmail: student.email,
            recipientName: student.name,
            periodTitle: period.title,
            deadline: period.deadline,
            daysRemaining: period.daysRemaining
          });
          sentCount++;
        } catch (error) {
          errors.push({ email: student.email, error: error.message });
        }
      }

      // Mark reminder as sent
      await period.markReminderSent();

      logger.info(
        `[WorksheetService] Reminder notifications sent for period ${periodId}. Sent: ${sentCount}, Errors: ${errors.length}`
      );

      return {
        totalPending: pendingStudents.length,
        sent: sentCount,
        errors
      };
    } catch (error) {
      logger.error(`[WorksheetService] Failed to send reminder notifications: ${error.message}`);
      throw error;
    }
  }
}

// Singleton instance
let instance = null;

export const getWorksheetService = () => {
  if (!instance) {
    instance = new WorksheetService();
  }
  return instance;
};

export default WorksheetService;
