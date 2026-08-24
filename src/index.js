import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from './config/index.js';
import { initializeDatabase } from './database/db.js';
import logger from './utils/logger.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Command collection
client.commands = new Collection();

/**
 * Initialize the bot
 */
async function initialize() {
  try {
    logger.info('🚀 Squadron X Esports Bot starting...');

    // Initialize database
    await initializeDatabase();
    logger.info('✅ Database initialized');

    // Load commands
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const command = await import(`file://${filePath}`);
      if (command.default?.data && command.default?.execute) {
        client.commands.set(command.default.data.name, command.default);
        logger.info(`✅ Loaded command: ${command.default.data.name}`);
      }
    }

    // Load events
    const eventsPath = join(__dirname, 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = await import(`file://${filePath}`);
      if (event.default?.name && event.default?.execute) {
        if (event.default.once) {
          client.once(event.default.name, (...args) => event.default.execute(...args, client));
        } else {
          client.on(event.default.name, (...args) => event.default.execute(...args, client));
        }
        logger.info(`✅ Loaded event: ${event.default.name}`);
      }
    }

    // Login to Discord
    await client.login(config.discord.token);
  } catch (error) {
    logger.error('❌ Failed to initialize bot:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  logger.info('Shutting down bot...');
  await client.destroy();
  process.exit(0);
});

// Start bot
initialize();

export default client;
