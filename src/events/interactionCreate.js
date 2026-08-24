import logger from '../utils/logger.js';
import { handleError, handlePermissionDenied } from '../utils/errorHandler.js';
import { getUserPermissionLevel, PERMISSION_LEVELS } from '../permissions/permissionManager.js';

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      logger.warn(`Unknown command: ${interaction.commandName}`);
      return;
    }

    try {
      // Check permission if required
      if (command.ownerOnly) {
        const userLevel = await getUserPermissionLevel(interaction.user.id);
        if (userLevel !== PERMISSION_LEVELS.BOT_OWNER) {
          await handlePermissionDenied(interaction);
          return;
        }
      }

      if (command.adminOnly) {
        const userLevel = await getUserPermissionLevel(interaction.user.id);
        if (userLevel !== PERMISSION_LEVELS.BOT_OWNER && userLevel !== PERMISSION_LEVELS.ADMIN) {
          await handlePermissionDenied(interaction);
          return;
        }
      }

      await command.execute(interaction);
    } catch (error) {
      await handleError(error, interaction, `command ${interaction.commandName}`);
    }
  },
};
