import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export const config = {
  // Discord Bot
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
  },

  // Bot Owner
  owner: {
    id: process.env.BOT_OWNER_ID,
  },

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'squadron_x_bot',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  },

  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // Paths
  paths: {
    logs: join(__dirname, '../../logs'),
    commands: join(__dirname, '../commands'),
    events: join(__dirname, '../events'),
    modules: join(__dirname, '../modules'),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
  },
};

// Validation
const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID', 'BOT_OWNER_ID'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please create a .env file with all required variables. See .env.example for template.');
  process.exit(1);
}

export default config;
