import { getWorksheetService } from '../services/WorksheetService.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { getEvidenceFileInfo } from '../middleware/multerWorksheet.js';
import { uploadWorksheetEvidenceBuffer } from '../services/CloudinaryService.js';
import {
  transformWorksheetUrls,
  transformWorksheetsUrls,
  transformPeriodWorksheetsUrls
} from '../utils/urlHelper.js';
import logger from '../utils/logger.js';

const worksheetService = getWorksheetService();

// ==================== PERIOD CONTROLLERS ====================

/**
 * @desc    Get all worksheet periods
 * @route   GET /api/worksheet/periods
 * @access  Private
 */
export const getAllPeriods = asyncHandler(async (req, res) => {
  const periods = await worksheetService.getAllPeriods();
  res.success(periods, 'Periods retrieved successfully', 200);
});

/**
 * @desc    Get period by ID
 * @route   GET /api/worksheet/periods/:id
 * @access  Private
 */
export const getPeriodById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const period = await worksheetService.getPeriodById(id);
  res.success(period, 'Period retrieved successfully', 200);
});

/**
 * @desc    Create new worksheet period
 * @route   POST /api/worksheet/periods
 * @access  Private/Admin
 */
export const createPeriod = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const periodData = req.body;

  const period = await worksheetService.createPeriod(periodData, adminId);
  res.success(period, 'Period created successfully', 201);
});

/**
 * @desc    Update worksheet period
 * @route   PUT /api/worksheet/periods/:id
 * @access  Private/Admin
 */
export const updatePeriod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const period = await worksheetService.updatePeriod(id, updateData);
  res.success(period, 'Period updated successfully', 200);
});

/**
 * @desc    Delete worksheet period
 * @route   DELETE /api/worksheet/periods/:id
 * @access  Private/Admin
 */
export const deletePeriod = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await worksheetService.deletePeriod(id);
  res.success(null, 'Period deleted successfully', 200);
});

/**
 * @desc    Activate worksheet period
 * @route   PUT /api/worksheet/periods/:id/activate
 * @access  Private/Admin
 */
export const activatePeriod = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const period = await worksheetService.activatePeriod(id);
  res.success(period, 'Period activated successfully', 200);
});

/**
 * @desc    Close worksheet period
 * @route   PUT /api/worksheet/periods/:id/close
 * @access  Private/Admin
 */
export const closePeriod = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const period = await worksheetService.closePeriod(id);
  res.success(period, 'Period closed successfully', 200);
});

// ==================== WORKSHEET CONTROLLERS (STUDENT) ====================

/**
 * @desc    Get current user's worksheets for all periods
 * @route   GET /api/worksheet/my-worksheets
 * @access  Private/Student
 */
export const getMyWorksheets = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;

  const worksheets = await worksheetService.getUserWorksheets(userId);
  // Transform local file paths to HTTP URLs for evidence (nested period-worksheet structure)
  const transformedWorksheets = transformPeriodWorksheetsUrls(worksheets);

  // Debug logging to verify transformation
  logger.info(`[getMyWorksheets] Returning ${transformedWorksheets.length} worksheet entries`);
  if (
    transformedWorksheets.length > 0 &&
    transformedWorksheets[0].worksheet?.evidence?.length > 0
  ) {
    const firstEvidence = transformedWorksheets[0].worksheet.evidence[0];
    logger.info(
      `[getMyWorksheets] First evidence _id: ${firstEvidence._id || firstEvidence.id || 'UNDEFINED'}`
    );
    logger.info(
      `[getMyWorksheets] First evidence fileUrl: ${firstEvidence.fileUrl || 'UNDEFINED'}`
    );
    logger.info(
      `[getMyWorksheets] First evidence filePath: ${firstEvidence.filePath || 'UNDEFINED'}`
    );
  }

  res.success(transformedWorksheets, 'Worksheets retrieved successfully', 200);
});

/**
 * @desc    Get current user's worksheet for a specific period
 * @route   GET /api/worksheet/my-worksheets/:periodId
 * @access  Private/Student
 */
export const getMyWorksheetByPeriod = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { periodId } = req.params;

  const worksheet = await worksheetService.getWorksheet(userId, periodId);
  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheet = worksheet ? transformWorksheetUrls(worksheet) : null;
  res.success(transformedWorksheet, 'Worksheet retrieved successfully', 200);
});

/**
 * @desc    Save worksheet draft
 * @route   POST /api/worksheet/save-draft/:periodId
 * @access  Private/Student
 */
export const saveWorksheetDraft = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { periodId } = req.params;
  const { activityDescription } = req.body;

  const worksheetData = { activityDescription };

  const worksheet = await worksheetService.saveWorksheetDraft(userId, periodId, worksheetData);
  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheet = transformWorksheetUrls(worksheet);
  res.success(transformedWorksheet, 'Draft saved successfully', 200);
});

/**
 * @desc    Submit worksheet
 * @route   POST /api/worksheet/submit/:periodId
 * @access  Private/Student
 */
export const submitWorksheet = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { periodId } = req.params;
  const { activityDescription } = req.body;

  const worksheetData = activityDescription ? { activityDescription } : null;

  const worksheet = await worksheetService.submitWorksheet(userId, periodId, worksheetData);
  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheet = transformWorksheetUrls(worksheet);
  res.success(transformedWorksheet, 'Worksheet submitted successfully', 200);
});

/**
 * @desc    Upload evidence files
 * @route   POST /api/worksheet/upload-evidence/:periodId
 * @access  Private/Student
 */
export const uploadEvidence = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { periodId } = req.params;

  // Debug logging
  logger.info(`[uploadEvidence] Request received for period ${periodId}, user ${userId}`);
  logger.info(`[uploadEvidence] Content-Type: ${req.headers['content-type']}`);
  logger.info(`[uploadEvidence] Files received: ${req.files ? req.files.length : 'none'}`);

  if (!req.files || req.files.length === 0) {
    logger.warn('[uploadEvidence] No files in request');
    return res.error('No files uploaded', 400);
  }

  // Upload each file to Cloudinary and get evidence info
  const evidenceFiles = [];

  for (const file of req.files) {
    try {
      logger.info(`[uploadEvidence] Uploading file: ${file.originalname} (${file.mimetype})`);

      // Upload to Cloudinary
      const cloudinaryResult = await uploadWorksheetEvidenceBuffer(
        file.buffer,
        file.originalname,
        file.mimetype,
        userId.toString(),
        periodId
      );

      // Create evidence info object
      const evidenceInfo = getEvidenceFileInfo(file, cloudinaryResult);
      evidenceFiles.push(evidenceInfo);

      logger.info(`[uploadEvidence] File uploaded to Cloudinary: ${cloudinaryResult.url}`);
    } catch (uploadError) {
      logger.error(
        `[uploadEvidence] Failed to upload ${file.originalname}: ${uploadError.message}`
      );
      return res.error(`Failed to upload file: ${file.originalname}`, 500);
    }
  }

  logger.info(`[uploadEvidence] Successfully uploaded ${evidenceFiles.length} files to Cloudinary`);

  const worksheet = await worksheetService.addEvidence(userId, periodId, evidenceFiles);
  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheet = transformWorksheetUrls(worksheet);
  res.success(transformedWorksheet, 'Evidence uploaded successfully', 200);
});

/**
 * @desc    Remove evidence file
 * @route   DELETE /api/worksheet/evidence/:periodId/:evidenceId
 * @access  Private/Student
 */
export const removeEvidence = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { periodId, evidenceId } = req.params;

  const worksheet = await worksheetService.removeEvidence(userId, periodId, evidenceId);
  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheet = transformWorksheetUrls(worksheet);
  res.success(transformedWorksheet, 'Evidence removed successfully', 200);
});

// ==================== WORKSHEET CONTROLLERS (ADMIN) ====================

/**
 * @desc    Get all worksheets for a period
 * @route   GET /api/worksheet/admin/period/:periodId
 * @access  Private/Admin
 */
export const getWorksheetsByPeriod = asyncHandler(async (req, res) => {
  const { periodId } = req.params;
  const filters = {
    validationStatus: req.query.status,
    isSubmitted:
      req.query.submitted === 'true' ? true : req.query.submitted === 'false' ? false : undefined
  };

  const worksheets = await worksheetService.getWorksheetsByPeriod(periodId, filters);
  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheets = transformWorksheetsUrls(worksheets);
  res.success(transformedWorksheets, 'Worksheets retrieved successfully', 200);
});

/**
 * @desc    Get validation statistics for a period
 * @route   GET /api/worksheet/admin/period/:periodId/stats
 * @access  Private/Admin
 */
export const getValidationStats = asyncHandler(async (req, res) => {
  const { periodId } = req.params;

  const stats = await worksheetService.getValidationStats(periodId);
  res.success(stats, 'Statistics retrieved successfully', 200);
});

/**
 * @desc    Validate a single worksheet
 * @route   PUT /api/worksheet/admin/validate/:worksheetId
 * @access  Private/Admin
 */
export const validateWorksheet = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const { worksheetId } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.error('Validation status is required', 400);
  }

  const worksheet = await worksheetService.validateWorksheet(worksheetId, adminId, status, notes);
  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheet = transformWorksheetUrls(worksheet);
  res.success(transformedWorksheet, 'Worksheet validated successfully', 200);
});

/**
 * @desc    Run auto-validation for a period
 * @route   POST /api/worksheet/admin/period/:periodId/auto-validate
 * @access  Private/Admin
 */
export const runAutoValidation = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const { periodId } = req.params;

  const results = await worksheetService.runAutoValidation(periodId, adminId);
  res.success(results, 'Auto-validation completed successfully', 200);
});

/**
 * @desc    Export worksheet data for a period
 * @route   GET /api/worksheet/admin/period/:periodId/export
 * @access  Private/Admin
 */
export const exportWorksheetData = asyncHandler(async (req, res) => {
  const { periodId } = req.params;

  const exportData = await worksheetService.exportWorksheetData(periodId);

  // Set headers for JSON download
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=worksheet_period_${exportData.period.periodNumber}_${Date.now()}.json`
  );

  res.send(JSON.stringify(exportData, null, 2));
});

/**
 * @desc    Export worksheet data as CSV
 * @route   GET /api/worksheet/admin/period/:periodId/export-csv
 * @access  Private/Admin
 */
export const exportWorksheetCSV = asyncHandler(async (req, res) => {
  const { periodId } = req.params;

  const exportData = await worksheetService.exportWorksheetData(periodId);

  // Convert to CSV
  const headers = [
    'No',
    'Dicoding ID',
    'Nama',
    'Email',
    'Learning Path',
    'Universitas',
    'Submitted',
    'Submitted At',
    'Terlambat',
    'Jumlah Bukti',
    'Status Validasi',
    'Catatan Admin',
    'Divalidasi Oleh',
    'Tanggal Validasi'
  ];

  const csvRows = [headers.join(',')];

  exportData.data.forEach((row) => {
    const values = [
      row.no,
      `"${row.dicoding_id}"`,
      `"${row.name}"`,
      `"${row.email}"`,
      `"${row.learning_path}"`,
      `"${row.university}"`,
      row.submitted,
      `"${row.submitted_at}"`,
      row.is_late,
      row.evidence_count,
      `"${row.validation_status}"`,
      `"${row.admin_notes.replace(/"/g, '""')}"`,
      `"${row.validated_by}"`,
      `"${row.validated_at}"`
    ];
    csvRows.push(values.join(','));
  });

  const csvContent = csvRows.join('\n');

  // Set headers for CSV download
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=worksheet_period_${exportData.period.periodNumber}_${Date.now()}.csv`
  );

  // Add BOM for Excel compatibility
  res.send('\uFEFF' + csvContent);
});

/**
 * @desc    Send reminder notifications
 * @route   POST /api/worksheet/admin/period/:periodId/send-reminders
 * @access  Private/Admin
 */
export const sendReminderNotifications = asyncHandler(async (req, res) => {
  const { periodId } = req.params;

  const results = await worksheetService.sendReminderNotifications(periodId);
  res.success(results, 'Reminder notifications sent', 200);
});

/**
 * @desc    Get worksheet detail by ID (admin)
 * @route   GET /api/worksheet/admin/detail/:worksheetId
 * @access  Private/Admin
 */
export const getWorksheetDetail = asyncHandler(async (req, res) => {
  const { worksheetId } = req.params;

  const Worksheet = (await import('../models/Worksheet.js')).default;
  const worksheet = await Worksheet.findById(worksheetId)
    .populate('userId', 'name email dicodingId learningPathName university profilePicture')
    .populate('periodId', 'periodNumber title startDate deadline status')
    .populate('validatedBy', 'name email');

  if (!worksheet) {
    return res.error('Worksheet not found', 404);
  }

  // Transform local file paths to HTTP URLs for evidence
  const transformedWorksheet = transformWorksheetUrls(worksheet);
  res.success(transformedWorksheet, 'Worksheet detail retrieved successfully', 200);
});
