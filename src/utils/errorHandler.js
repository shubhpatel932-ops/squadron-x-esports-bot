import logger from './logger.js';
import { branding } from '../config/branding.js';

/**
 * Global error handler for Discord interactions
 */
export async function handleError(error, interaction, context = '') {
  logger.error(`Error in ${context}:`, {
    error: error.message,
    stack: error.stack,
    userId: interaction?.user?.id,
    commandName: interaction?.commandName || 'unknown',
  });

  try {
    const errorEmbed = {
      color: branding.colors.error,
      title: '❌ An Error Occurred',
      description: branding.messages.errorOccurred,
      fields: [
        {
          name: 'Assistance',
          value: branding.messages.contactAdmin,
        },
      ],
      footer: branding.embeds.footer,
      timestamp: new Date(),
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  } catch (replyError) {
    logger.error('Failed to send error message:', replyError);
  }
}

/**
 * Handle permission denied
 */
export async function handlePermissionDenied(interaction) {
  const embed = {
    color: branding.colors.error,
    title: '❌ Permission Denied',
    description: branding.messages.noPermission,
    footer: branding.embeds.footer,
    timestamp: new Date(),
  };

  logger.warn('Permission denied', {
    userId: interaction.user.id,
    commandName: interaction.commandName,
  });

  if (interaction.replied || interaction.deferred) {
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  } else {
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export default { handleError, handlePermissionDenied };
