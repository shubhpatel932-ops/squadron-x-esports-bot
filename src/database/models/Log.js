import { query } from '../db.js';
import logger from '../../utils/logger.js';

/**
 * Log model for database operations
 */
export class Log {
  static async create(action, userId, targetId, details = {}) {
    try {
      const result = await query(
        `INSERT INTO activity_logs (action, user_id, target_id, details, timestamp)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`,
        [action, userId, targetId, JSON.stringify(details)]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error in Log.create:', error);
      throw error;
    }
  }

  static async getRecentLogs(limit = 50) {
    try {
      const result = await query(
        `SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error in Log.getRecentLogs:', error);
      throw error;
    }
  }

  static async getLogsByUser(userId, limit = 50) {
    try {
      const result = await query(
        `SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2`,
        [userId, limit]
      );
      return result.rows;
    } catch (error) {
      logger.error('Error in Log.getLogsByUser:', error);
      throw error;
    }
  }
}

export default Log;
