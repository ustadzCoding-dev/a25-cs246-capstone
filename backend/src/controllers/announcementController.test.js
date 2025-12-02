import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenError } from '../utils/errorHandler.js';
import * as announcementController from './announcementController.js';

// Mock models
vi.mock('../models/Announcement.js');
vi.mock('../models/User.js');

describe('Announcement Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123', role: 'admin' },
      params: {},
      body: {},
      query: {},
      validatedBody: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      success: vi.fn().mockReturnThis()
    };
  });

  describe('Authorization Tests', () => {
    it('should allow admin to create announcement', async () => {
      req.validatedBody = { title: 'Test', content: 'Content', priority: 'high' };

      await announcementController.createAnnouncement(req, res);

      expect(res.success).toHaveBeenCalled();
    });

    it('should throw ForbiddenError for non-admin user on create', async () => {
      req.user.role = 'student';
      req.validatedBody = { title: 'Test', content: 'Content' };

      await expect(announcementController.createAnnouncement(req, res))
        .rejects
        .toThrow(ForbiddenError);
    });

    it('should throw error when user is not authenticated on create', async () => {
      req.user = null;
      req.validatedBody = { title: 'Test', content: 'Content' };

      await expect(announcementController.createAnnouncement(req, res))
        .rejects
        .toThrow(ForbiddenError);
    });

    it('should verify getAnnouncementById requires authentication', async () => {
      req.user = null;
      req.params = { id: '123' };

      await announcementController.getAnnouncementById(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
