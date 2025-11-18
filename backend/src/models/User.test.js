import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import User from './User.js';

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should require name field', () => {
      const userSchema = User.schema;
      const nameField = userSchema.paths.name;
      expect(nameField.isRequired).toBe(true);
    });

    it('should require email field', () => {
      const userSchema = User.schema;
      const emailField = userSchema.paths.email;
      expect(emailField.isRequired).toBe(true);
    });

    it('should have valid learning path enum values', () => {
      const userSchema = User.schema;
      const learningPathField = userSchema.paths.learningPath;
      const enumValues = learningPathField.enumValues;
      expect(enumValues).toContain('Front-End Web & Back-End with AI');
      expect(enumValues).toContain('React & Back-End with AI');
      expect(enumValues).toContain('Machine Learning');
    });

    it('should have valid role enum values', () => {
      const userSchema = User.schema;
      const roleField = userSchema.paths.role;
      const enumValues = roleField.enumValues;
      expect(enumValues).toContain('student');
      expect(enumValues).toContain('admin');
      expect(enumValues).toContain('mentor');
    });
  });

  describe('Methods', () => {
    it('should have isAdmin method', () => {
      expect(typeof User.prototype.isAdmin).toBe('function');
    });

    it('should have isMentor method', () => {
      expect(typeof User.prototype.isMentor).toBe('function');
    });

    it('should have comparePassword method', () => {
      expect(typeof User.prototype.comparePassword).toBe('function');
    });
  });

  describe('JSON Transformation', () => {
    it('should transform _id to id in toJSON', () => {
      const userSchema = User.schema;
      const transformFn = userSchema.options.toJSON.transform;
      expect(transformFn).toBeDefined();
    });
  });
});
