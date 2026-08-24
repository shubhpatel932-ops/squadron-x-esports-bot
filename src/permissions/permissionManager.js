import logger from '../utils/logger.js';
import { query } from '../database/db.js';
import { config } from '../config/index.js';

/**
 * Permission levels for the bot
 */
export const PERMISSION_LEVELS = {
  BOT_OWNER: 'bot_owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
};

/**
 * Admin permissions
 */
export const ADMIN_PERMISSIONS = {
  TOURNAMENT_MANAGEMENT: 'tournament_management',
  PLAYER_MANAGEMENT: 'player_management',
  TEAM_MANAGEMENT: 'team_management',
  MATCH_MANAGEMENT: 'match_management',
  ANNOUNCEMENT_MANAGEMENT: 'announcement_management',
  MODERATION: 'moderation',
  LOGS: 'logs',
  STAFF_MANAGEMENT: 'staff_management',
};

/**
 * Check if user is bot owner
 */
export function isBotOwner(userId) {
  return userId === config.owner.id;
}

/**
 * Get user permission level
 */
export async function getUserPermissionLevel(userId) {
  // Bot owner has highest permission
  if (isBotOwner(userId)) {
    return PERMISSION_LEVELS.BOT_OWNER;
  }

  try {
    // Check if user is admin
    const result = await query(
      'SELECT permission_level FROM squadron_admins WHERE discord_id = $1 AND active = true',
      [userId]
    );

    if (result.rows.length > 0) {
      return result.rows[0].permission_level || PERMISSION_LEVELS.ADMIN;
    }
  } catch (error) {
    logger.error('Error checking user permission level:', error);
  }

  return PERMISSION_LEVELS.USER;
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(userId, permission) {
  const permissionLevel = await getUserPermissionLevel(userId);

  // Bot owner has all permissions
  if (permissionLevel === PERMISSION_LEVELS.BOT_OWNER) {
    return true;
  }

  // Admin permissions check
  if (permissionLevel === PERMISSION_LEVELS.ADMIN) {
    try {
      const result = await query(
        'SELECT admin_permissions FROM squadron_admins WHERE discord_id = $1 AND active = true',
        [userId]
      );

      if (result.rows.length > 0) {
        const permissions = result.rows[0].admin_permissions || [];
        return permissions.includes(permission);
      }
    } catch (error) {
      logger.error('Error checking admin permissions:', error);
      return false;
    }
  }

  return false;
}

/**
 * Add admin to system
 */
export async function addAdmin(userId, adminPermissions = []) {
  try {
    await query(
      `INSERT INTO squadron_admins (discord_id, admin_permissions, permission_level, active, created_at)
       VALUES ($1, $2, $3, true, NOW())
       ON CONFLICT (discord_id) DO UPDATE SET admin_permissions = $2, active = true`,
      [userId, adminPermissions, PERMISSION_LEVELS.ADMIN]
    );

    logger.info('Admin added', { userId, permissions: adminPermissions });
    return true;
  } catch (error) {
    logger.error('Error adding admin:', error);
    return false;
  }
}

/**
 * Remove admin from system
 */
export async function removeAdmin(userId) {
  try {
    await query(
      'UPDATE squadron_admins SET active = false, updated_at = NOW() WHERE discord_id = $1',
      [userId]
    );

    logger.info('Admin removed', { userId });
    return true;
  } catch (error) {
    logger.error('Error removing admin:', error);
    return false;
  }
}

export default { isBotOwner, getUserPermissionLevel, hasPermission, addAdmin, removeAdmin };
