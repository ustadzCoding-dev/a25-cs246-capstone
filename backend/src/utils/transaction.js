import mongoose from 'mongoose';

/**
 * Execute operation with MongoDB transaction support
 * Ensures atomicity of multi-step operations
 *
 * @param {Function} operation - Async function to execute within transaction
 * @returns {Promise<Object>} Result of operation
 * @throws {Error} If transaction fails
 */
export async function withTransaction(operation) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('[withTransaction] Starting transaction...');
    const result = await operation(session);
    await session.commitTransaction();
    console.log('[withTransaction] Transaction committed successfully');
    return result;
  } catch (error) {
    await session.abortTransaction();
    console.error('[withTransaction] Transaction aborted:', error.message);
    throw error;
  } finally {
    await session.endSession();
  }
}

/**
 * Execute multiple operations atomically
 *
 * @param {Array<Function>} operations - Array of async functions
 * @returns {Promise<Array>} Results of all operations
 */
export async function withMultipleTransactions(operations) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('[withMultipleTransactions] Starting transaction with', operations.length, 'operations');
    const results = [];

    for (let i = 0; i < operations.length; i++) {
      const result = await operations[i](session);
      results.push(result);
      console.log(`[withMultipleTransactions] Operation ${i + 1}/${operations.length} completed`);
    }

    await session.commitTransaction();
    console.log('[withMultipleTransactions] All transactions committed successfully');
    return results;
  } catch (error) {
    await session.abortTransaction();
    console.error('[withMultipleTransactions] Transaction aborted:', error.message);
    throw error;
  } finally {
    await session.endSession();
  }
}
