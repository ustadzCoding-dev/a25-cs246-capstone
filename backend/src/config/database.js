import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { setTimeout, setInterval, clearTimeout } from 'timers';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.warn('MONGODB_URI not configured. Skipping database connection.');
      logger.warn('Server will run without database. Configure MONGODB_URI in .env to enable database.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings - Adjusted for M0 cluster (max 3 connections)
      maxPoolSize: 3,
      minPoolSize: 1,
      // Timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      // Retry settings
      retryWrites: true,
      retryReads: true
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`Database: ${conn.connection.name}`);

    // Periodic connection health check (every 30 seconds)
    setInterval(async () => {
      try {
        if (mongoose.connection.readyState === 1) { // 1 = connected
          await mongoose.connection.db.admin().ping();
        }
      } catch (err) {
        logger.warn(`Connection health check failed: ${err.message}`);
      }
    }, 30000);

    // Fix duplicate key error: Drop problematic index if it exists
    try {
      const db = mongoose.connection.db;
      const collection = db.collection('capstonegroups');

      // Check if index exists and drop it
      // Use listIndexes() instead of deprecated getIndexes()
      const indexList = await collection.listIndexes().toArray();
      const hasProblematicIndex = indexList.some(idx => idx.name === 'capstoneGroupId_1');

      if (hasProblematicIndex) {
        logger.warn('Found problematic capstoneGroupId_1 index. Dropping it...');
        await collection.dropIndex('capstoneGroupId_1');
        logger.info('✅ Dropped capstoneGroupId_1 index successfully');
      } else {
        logger.info('✅ capstoneGroupId_1 index does not exist (expected)');
      }
    } catch (indexError) {
      // Index might not exist, which is fine
      if (indexError.message.includes('index not found') || indexError.message.includes('ns does not exist')) {
        logger.info('✅ capstoneGroupId_1 index does not exist (expected)');
      } else {
        logger.warn(`Warning while checking indexes: ${indexError.message}`);
      }
    }
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    logger.warn('Server will continue without database connection');
    // Don't exit, allow server to run for testing
    // process.exit(1)
  }
};

// Handle connection events
let reconnectAttempts = 0;
const maxReconnectAttempts = 3; // Reduced from 5 for M0 cluster
let isReconnecting = false;
let disconnectDebounceTimer; // Debounce timer for disconnect events

// Circuit Breaker Pattern
let circuitBreakerOpen = false;
let failureCount = 0;
let failureWindow = []; // Track failures in time window
const failureThreshold = 3; // Fail 3 times
const failureWindowMs = 5 * 60 * 1000; // 5 minutes
const circuitBreakerDuration = 10 * 60 * 1000; // 10 minutes

// Helper function to track failures
const trackFailure = () => {
  const now = Date.now();
  failureWindow = failureWindow.filter(time => now - time < failureWindowMs);
  failureWindow.push(now);
  failureCount = failureWindow.length;
  return failureCount;
};

// Helper function to reset failures
const resetFailures = () => {
  failureWindow = [];
  failureCount = 0;
  reconnectAttempts = 0;
};

// Exponential backoff with jitter: 5s ± 1s, 10s ± 2s, 20s ± 4s, etc.
const getReconnectDelay = (attempt) => {
  const baseDelay = Math.min(5000 * Math.pow(2, attempt - 1), 120000);
  const jitter = Math.random() * Math.min(baseDelay * 0.4, 5000); // Up to 40% jitter
  return baseDelay + jitter;
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');

  // Debounce: Clear existing timer and set new one
  // This prevents reconnection loop by waiting 60s before attempting reconnect
  if (disconnectDebounceTimer) {
    clearTimeout(disconnectDebounceTimer);
  }

  disconnectDebounceTimer = setTimeout(() => {
    // Check Circuit Breaker status
    if (circuitBreakerOpen) {
      logger.warn('⚠️ Circuit breaker is OPEN. Stopping reconnection attempts for 10 minutes.');
      logger.warn('Too many failures detected. MongoDB service may be down or unreachable.');
      return;
    }

    // Prevent multiple reconnect attempts from firing simultaneously
    if (isReconnecting) {
      logger.warn('Reconnection already in progress, skipping...');
      return;
    }

    // Track failures in time window
    const currentFailureCount = trackFailure();

    // Check if we've exceeded failure threshold
    if (currentFailureCount >= failureThreshold) {
      logger.error(`❌ Circuit breaker triggered: ${currentFailureCount} failures in ${failureWindowMs / 1000 / 60} minutes`);
      circuitBreakerOpen = true;

      // Reset circuit breaker after duration
      setTimeout(() => {
        circuitBreakerOpen = false;
        resetFailures();
        logger.info('🔄 Circuit breaker RESET. Attempting reconnection again...');
      }, circuitBreakerDuration);

      return;
    }

    // Auto-reconnect logic with exponential backoff
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      const delay = getReconnectDelay(reconnectAttempts);
      const delaySeconds = (delay / 1000).toFixed(1);

      logger.info(`Attempting to reconnect to MongoDB (attempt ${reconnectAttempts}/${maxReconnectAttempts}) in ${delaySeconds}s...`);
      isReconnecting = true;

      setTimeout(() => {
        if (!process.env.MONGODB_URI) {
          isReconnecting = false;
          return;
        }

        mongoose.connect(process.env.MONGODB_URI, {
          maxPoolSize: 3,
          minPoolSize: 1,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
          retryWrites: true,
          retryReads: true
        }).then(() => {
          resetFailures();
          isReconnecting = false;
          logger.info('✅ MongoDB reconnected successfully');
        }).catch((err) => {
          isReconnecting = false;
          logger.error(`Reconnection failed: ${err.message}`);
        });
      }, delay);
    } else {
      logger.error('Max reconnection attempts reached. Please check your MongoDB connection.');
      isReconnecting = false;
    }
  }, 60000); // Debounce: Wait 60 seconds before attempting reconnect
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected');
  resetFailures();
  isReconnecting = false;
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB error: ${err}`);
});

export default connectDB;
