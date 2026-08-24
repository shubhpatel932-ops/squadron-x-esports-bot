import logger from '../utils/logger.js';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`✅ Bot logged in as ${client.user.tag}`);
    logger.info(`🎮 Bot is ready and running in ${client.guilds.cache.size} guild(s)`);
    client.user.setActivity('Squadron X Esports', { type: 'WATCHING' });
  },
};
