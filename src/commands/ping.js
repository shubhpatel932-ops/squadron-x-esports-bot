import { SlashCommandBuilder } from 'discord.js';
import { branding } from '../config/branding.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),
  async execute(interaction) {
    const latency = interaction.client.ws.ping;
    const embed = {
      color: branding.colors.info,
      title: '🏓 Pong!',
      description: `Bot latency: **${latency}ms**`,
      footer: branding.embeds.footer,
      timestamp: new Date(),
    };
    await interaction.reply({ embeds: [embed] });
  },
};
