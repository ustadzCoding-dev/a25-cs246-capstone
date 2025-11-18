/**
 * Timeline Helper Utilities
 * Functions to calculate and update timeline status based on dates
 */

/**
 * Calculate timeline status based on start/end dates
 * @param {Date} startDate - Timeline start date
 * @param {Date} endDate - Timeline end date
 * @returns {Object} Status and related info
 */
export const calculateTimelineStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  let status = 'upcoming';
  let daysRemaining = null;
  let isOverdue = false;

  if (now < start) {
    status = 'upcoming';
    daysRemaining = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
  } else if (now >= start && now <= end) {
    status = 'ongoing';
    daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  } else if (now > end) {
    status = 'overdue';
    isOverdue = true;
    daysRemaining = Math.ceil((now - end) / (1000 * 60 * 60 * 24));
  }

  return {
    status,
    daysRemaining,
    isOverdue
  };
};

/**
 * Update timeline document with calculated status
 * @param {Object} timelineDoc - Timeline document from MongoDB
 * @returns {Object} Updated timeline object
 */
export const updateTimelineWithStatus = (timelineDoc) => {
  const { status, daysRemaining, isOverdue } = calculateTimelineStatus(
    timelineDoc.startDate,
    timelineDoc.endDate
  );

  return {
    ...timelineDoc.toObject ? timelineDoc.toObject() : timelineDoc,
    status,
    daysRemaining,
    isOverdue
  };
};

/**
 * Batch update timelines with calculated status
 * @param {Array} timelines - Array of timeline documents
 * @returns {Array} Updated timelines
 */
export const updateTimelinesWithStatus = (timelines) => {
  return timelines.map((timeline) => updateTimelineWithStatus(timeline));
};
