/**
 * URL Helper Utility
 *
 * Transforms local file paths to HTTP URLs for serving files via the backend.
 * This is necessary because browsers block direct access to local file:// URLs
 * for security reasons.
 */

// Backend base URL - defaults to localhost for development
const getBackendUrl = () => {
  return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8000}`;
};

/**
 * Check if a path is a local file path (not an HTTP URL)
 * @param {string} filePath - The file path to check
 * @returns {boolean} - True if it's a local file path
 */
export const isLocalFilePath = (filePath) => {
  if (!filePath) {
    return false;
  }

  // Check for file:// protocol
  if (filePath.startsWith('file:///')) {
    return true;
  }

  // Check for Windows absolute paths (C:/, C:\, D:/, D:\, etc.)
  if (/^[A-Za-z]:[/\\]/.test(filePath)) {
    return true;
  }

  // Check for Unix absolute paths
  if (filePath.startsWith('/Users/') || filePath.startsWith('/home/')) {
    return true;
  }

  // Check for paths containing 'uploads' that are not HTTP URLs
  if (filePath.includes('uploads') && !filePath.startsWith('http')) {
    return true;
  }

  return false;
};

/**
 * Check if a URL is already an HTTP/HTTPS URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's an HTTP URL
 */
export const isHttpUrl = (url) => {
  if (!url) {
    return false;
  }
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Check if a URL is a Cloudinary URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  if (!url) {
    return false;
  }
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

/**
 * Extract relative path from a local file path
 * @param {string} localPath - The local file path
 * @returns {string|null} - The relative path starting from 'uploads' or null
 */
export const extractRelativePath = (localPath) => {
  if (!localPath) {
    return null;
  }

  let processedPath = localPath;

  // Handle file:/// protocol
  if (processedPath.startsWith('file:///')) {
    processedPath = processedPath.replace('file:///', '');
  }

  // Decode URI components (handles %20 spaces, etc.)
  try {
    processedPath = decodeURIComponent(processedPath);
  } catch {
    // If decoding fails, use the original path
  }

  // Normalize path separators to forward slashes
  processedPath = processedPath.replace(/\\/g, '/');

  // Find the uploads directory in the path
  const uploadsIndex = processedPath.toLowerCase().indexOf('uploads');
  if (uploadsIndex !== -1) {
    // Extract from 'uploads' onwards
    let relativePath = processedPath.substring(uploadsIndex);
    // Ensure it starts with /
    if (!relativePath.startsWith('/')) {
      relativePath = '/' + relativePath;
    }
    return relativePath;
  }

  return null;
};

/**
 * Convert a local file path to an HTTP URL
 * @param {string} localPath - The local file path
 * @returns {string} - The HTTP URL or the original path if conversion fails
 */
export const convertToHttpUrl = (localPath) => {
  if (!localPath) {
    return localPath;
  }

  // If it's already an HTTP URL, return as-is
  if (isHttpUrl(localPath)) {
    return localPath;
  }

  // If it's a Cloudinary URL, return as-is
  if (isCloudinaryUrl(localPath)) {
    return localPath;
  }

  // If it's not a local file path, return as-is
  if (!isLocalFilePath(localPath)) {
    return localPath;
  }

  // Extract relative path and convert to HTTP URL
  const relativePath = extractRelativePath(localPath);
  if (relativePath) {
    return `${getBackendUrl()}${relativePath}`;
  }

  // If we can't extract a relative path, return the original
  return localPath;
};

/**
 * Transform evidence array to use HTTP URLs instead of local file paths
 * @param {Array} evidence - Array of evidence objects
 * @returns {Array} - Transformed evidence array
 */
export const transformEvidenceUrls = (evidence) => {
  if (!evidence || !Array.isArray(evidence)) {
    return evidence;
  }

  return evidence.map((item) => {
    // Handle Mongoose subdocuments - convert to plain object if needed
    const itemObj = item.toObject ? item.toObject() : item;
    const transformed = { ...itemObj };

    // Preserve _id as both _id and id for frontend compatibility
    if (itemObj._id) {
      transformed._id = itemObj._id.toString ? itemObj._id.toString() : itemObj._id;
      transformed.id = transformed._id;
    }

    // Transform filePath if it's a local path
    if (transformed.filePath) {
      transformed.filePath = convertToHttpUrl(transformed.filePath);
    }

    // Transform fileUrl if it's a local path, or set it from filePath if undefined
    if (transformed.fileUrl) {
      transformed.fileUrl = convertToHttpUrl(transformed.fileUrl);
    } else if (transformed.filePath) {
      // If fileUrl is undefined but filePath exists, use the transformed filePath
      transformed.fileUrl = transformed.filePath;
    }

    return transformed;
  });
};

/**
 * Transform a worksheet object to use HTTP URLs for evidence
 * @param {Object} worksheet - The worksheet object
 * @returns {Object} - Transformed worksheet object
 */
export const transformWorksheetUrls = (worksheet) => {
  if (!worksheet) {
    return worksheet;
  }

  // Handle both plain objects and Mongoose documents
  const worksheetObj =
    typeof worksheet.toObject === 'function' ? worksheet.toObject() : { ...worksheet };

  if (worksheetObj.evidence && Array.isArray(worksheetObj.evidence)) {
    worksheetObj.evidence = transformEvidenceUrls(worksheetObj.evidence);
  }

  return worksheetObj;
};

/**
 * Transform an array of worksheets to use HTTP URLs
 * @param {Array} worksheets - Array of worksheet objects
 * @returns {Array} - Transformed worksheets array
 */
export const transformWorksheetsUrls = (worksheets) => {
  if (!worksheets || !Array.isArray(worksheets)) {
    return worksheets;
  }

  return worksheets.map((worksheet) => transformWorksheetUrls(worksheet));
};

/**
 * Transform period-worksheet pairs (from getUserWorksheets) to use HTTP URLs
 * This handles the nested structure: { period: {...}, worksheet: {...} }
 * @param {Array} periodWorksheets - Array of period-worksheet pair objects
 * @returns {Array} - Transformed array
 */
export const transformPeriodWorksheetsUrls = (periodWorksheets) => {
  if (!periodWorksheets || !Array.isArray(periodWorksheets)) {
    return periodWorksheets;
  }

  return periodWorksheets.map((item) => {
    if (!item) {
      return item;
    }

    const transformed = { ...item };

    // Transform the nested worksheet if it exists
    if (transformed.worksheet && transformed.worksheet.evidence) {
      transformed.worksheet = {
        ...transformed.worksheet,
        evidence: transformEvidenceUrls(transformed.worksheet.evidence)
      };
    }

    return transformed;
  });
};

export default {
  isLocalFilePath,
  isHttpUrl,
  isCloudinaryUrl,
  extractRelativePath,
  convertToHttpUrl,
  transformEvidenceUrls,
  transformWorksheetUrls,
  transformWorksheetsUrls,
  transformPeriodWorksheetsUrls
};
