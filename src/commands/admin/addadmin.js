import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { branding } from '../../config/branding.js';
import { addAdmin, ADMIN_PERMISSIONS } from '../../permissions/permissionManager.js';
import logger from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('addadmin')
    .setDescription('Add a user as Squadron X admin (Owner only)')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to make admin')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('permission')
        .setDescription('Admin permission type')
        .setRequired(true)
        .addChoices(
          { name: 'Tournament Management', value: ADMIN_PERMISSIONS.TOURNAMENT_MANAGEMENT },
          { name: 'Player Management', value: ADMIN_PERMISSIONS.PLAYER_MANAGEMENT },
          { name: 'Team Management', value: ADMIN_PERMISSIONS.TEAM_MANAGEMENT },
          { name: 'Match Management', value: ADMIN_PERMISSIONS.MATCH_MANAGEMENT },
          { name: 'Announcement Management', value: ADMIN_PERMISSIONS.ANNOUNCEMENT_MANAGEMENT },
          { name: 'Moderation', value: ADMIN_PERMISSIONS.MODERATION },
          { name: 'Logs', value: ADMIN_PERMISSIONS.LOGS },
          { name: 'Staff Management', value: ADMIN_PERMISSIONS.STAFF_MANAGEMENT }
        )
    ),
  ownerOnly: true,
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const permission = interaction.options.getString('permission');

    const success = await addAdmin(user.id, [permission]);

    const embed = {
      color: success ? branding.colors.success : branding.colors.error,
      title: success ? '✅ Admin Added' : '❌ Failed to Add Admin',
      description: success
        ? `${user.username} has been added as admin with **${permission}** permission`
        : 'Failed to add admin. Please try again.',
      footer: branding.embeds.footer,
      timestamp: new Date(),
    };

    if (success) {
      logger.info('Admin added', { addedBy: interaction.user.id, newAdmin: user.id, permission });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
