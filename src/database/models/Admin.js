import { query } from '../db.js';
import logger from '../../utils/logger.js';

/**
 * Admin model for database operations
 */
export class Admin {
  static async findById(discordId) {
    try {
      const result = await query(
        'SELECT * FROM squadron_admins WHERE discord_id = $1',
        [discordId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in Admin.findById:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const result = await query(
        'SELECT * FROM squadron_admins WHERE active = true ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      logger.error('Error in Admin.getAll:', error);
      throw error;
    }
  }

  static async create(discordId, permissions = []) {
    try {
      const result = await query(
        `INSERT INTO squadron_admins (discord_id, admin_permissions, permission_level, active, created_at)
         VALUES ($1, $2, 'admin', true, NOW())
         RETURNING *`,
        [discordId, permissions]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error in Admin.create:', error);
      throw error;
    }
  }

  static async updatePermissions(discordId, permissions) {
    try {
      const result = await query(
        `UPDATE squadron_admins SET admin_permissions = $1, updated_at = NOW()
         WHERE discord_id = $2 RETURNING *`,
        [permissions, discordId]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error in Admin.updatePermissions:', error);
      throw error;
    }
  }

  static async deactivate(discordId) {
    try {
      const result = await query(
        `UPDATE squadron_admins SET active = false, updated_at = NOW()
         WHERE discord_id = $1 RETURNING *`,
        [discordId]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error in Admin.deactivate:', error);
      throw error;
    }
  }
}

export default Admin;
