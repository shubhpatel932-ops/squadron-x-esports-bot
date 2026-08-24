import { Client, Collection, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

// Ping Command
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

client.commands.set('ping', { data: pingCommand });

// Test Command
const testCommand = new SlashCommandBuilder()
  .setName('test')
  .setDescription('Test if bot is working');

client.commands.set('test', { data: testCommand });

// Hello Command
const helloCommand = new SlashCommandBuilder()
  .setName('hello')
  .setDescription('Bot says hello!');

client.commands.set('hello', { data: helloCommand });

// Ready Event
client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`🎮 Bot is ready!`);
  console.log(`📊 Serving ${client.guilds.cache.size} guild(s)`);
});

// Interaction Handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (interaction.commandName === 'ping') {
      await interaction.reply(`🏓 Pong! Latency is ${Math.round(client.ws.ping)}ms`);
    } else if (interaction.commandName === 'test') {
      await interaction.reply('✅ Bot is working perfectly!');
    } else if (interaction.commandName === 'hello') {
      await interaction.reply(`👋 Hello ${interaction.user.username}! Welcome to Squadron X Esports!`);
    }
  } catch (error) {
    console.error('Error handling command:', error);
    await interaction.reply('❌ An error occurred!');
  }
});

// Register Commands
async function registerCommands() {
  const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('🔄 Registering slash commands...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commands,
    });
    console.log('✅ Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Login
client.login(process.env.DISCORD_TOKEN);

// Register commands after login
client.once('ready', registerCommands);
