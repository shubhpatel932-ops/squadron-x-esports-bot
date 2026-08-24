import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import logger from '../utils/logger.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db = null;

/**
 * Initialize SQLite Database
 */
export async function initializeDatabase() {
  try {
    db = await open({
      filename: join(__dirname, '../../squadron_x_bot.db'),
      driver: sqlite3.Database,
    });

    await db.exec('PRAGMA foreign_keys = ON');
    logger.info('✅ SQLite Database connected');

    // Create tables
    await createTables();
    logger.info('✅ Database tables initialized');

    return db;
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Create all required tables
 */
async function createTables() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS discord_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT UNIQUE NOT NULL,
      username TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS squadron_admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT UNIQUE NOT NULL,
      permission_level TEXT DEFAULT 'admin',
      admin_permissions TEXT DEFAULT '[]',
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      user_id TEXT,
      target_id TEXT,
      details TEXT DEFAULT '{}',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS server_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT UNIQUE NOT NULL,
      log_channel_id TEXT,
      announcement_channel_id TEXT,
      tournament_category_id TEXT,
      admin_role_id TEXT,
      staff_role_id TEXT,
      player_role_id TEXT,
      team_role_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'planning',
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT NOT NULL,
      username TEXT NOT NULL,
      in_game_name TEXT,
      guild_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      name TEXT NOT NULL,
      captain_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_discord_users_discord_id ON discord_users(discord_id);
    CREATE INDEX IF NOT EXISTS idx_squadron_admins_discord_id ON squadron_admins(discord_id);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_server_config_guild_id ON server_config(guild_id);
    CREATE INDEX IF NOT EXISTS idx_tournaments_guild_id ON tournaments(guild_id);
    CREATE INDEX IF NOT EXISTS idx_players_guild_id ON players(guild_id);
    CREATE INDEX IF NOT EXISTS idx_teams_guild_id ON teams(guild_id);
  `);
}

/**
 * Execute database query
 */
export async function query(sql, params = []) {
  try {
    if (sql.trim().toLowerCase().startsWith('select')) {
      const result = await db.all(sql, params);
      return { rows: result || [] };
    } else {
      const result = await db.run(sql, params);
      return { rows: [result] };
    }
  } catch (error) {
    logger.error('Database query error:', { sql, error: error.message });
    throw error;
  }
}

/**
 * Get database connection
 */
export function getDb() {
  return db;
}

export default { initializeDatabase, query, getDb };
