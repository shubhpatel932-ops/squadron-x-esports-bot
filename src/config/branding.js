/**
 * Centralized branding configuration for Squadron X Esports
 * All visual elements can be customized from this single file
 */

export const branding = {
  botName: 'Squadron X Esports',
  
  colors: {
    primary: 0x1a1a2e,      // Dark blue-black
    success: 0x00d084,       // Green
    warning: 0xffa502,       // Orange
    error: 0xff4757,         // Red
    info: 0x0078d4,          // Blue
    secondary: 0x2d3561,     // Dark purple
  },

  embeds: {
    footer: {
      text: 'Squadron X Esports',
      iconURL: 'https://via.placeholder.com/32x32.png?text=SXE', // Replace with actual logo
    },
    timestamp: true,
  },

  emojis: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳',
    tournament: '🏆',
    team: '👥',
    player: '👤',
    match: '⚔️',
    settings: '⚙️',
  },

  messages: {
    noPermission: 'You do not have permission to use this command.',
    errorOccurred: 'An error occurred while processing your request. Please try again later.',
    contactAdmin: 'Please contact an administrator for assistance.',
    success: 'Operation completed successfully.',
    cancelled: 'Operation cancelled.',
  },
};

export default branding;
