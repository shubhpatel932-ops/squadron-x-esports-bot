import { query } from '../db.js';
import logger from '../../utils/logger.js';

/**
 * User model for database operations
 */
export class User {
  static async findOrCreate(discordId, username) {
    try {
      const result = await query(
        `INSERT INTO discord_users (discord_id, username, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (discord_id) DO UPDATE SET username = $2, updated_at = NOW()
         RETURNING *`,
        [discordId, username]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error in User.findOrCreate:', error);
      throw error;
    }
  }

  static async findById(discordId) {
    try {
      const result = await query(
        'SELECT * FROM discord_users WHERE discord_id = $1',
        [discordId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in User.findById:', error);
      throw error;
    }
  }
}

export default User;
