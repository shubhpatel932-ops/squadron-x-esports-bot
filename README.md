# Squadron X Esports Discord Bot

A professional, scalable Discord bot for BGMI esports tournament management built for Squadron X Esports.

## 📋 Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Discord Bot Setup](#discord-bot-setup)
- [Running the Bot](#running-the-bot)
- [Architecture](#architecture)
- [Permission System](#permission-system)
- [Adding New Features](#adding-new-features)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Foundation (v1)
- ✅ Modular, scalable architecture
- ✅ Slash command framework
- ✅ Permission system (Bot Owner → Admins → Users)
- ✅ Admin framework with granular permissions
- ✅ Professional logging system
- ✅ Error handling & security
- ✅ Database integration (PostgreSQL)
- ✅ Configuration management
- ✅ Squadron X Esports branding

### Future Features
- Tournament management
- Player registration & management
- Team management
- Match scheduling
- Leaderboards & results
- Advanced analytics
- Website integration
- Notifications system

## 📦 Requirements

- Node.js 16.9.0 or higher
- PostgreSQL 12 or higher
- Discord Bot Token
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/shubhpatel932-ops/squadron-x-esports-bot.git
cd squadron-x-esports-bot
```

### 2. Install Dependencies
```bash
npm install
```

## ⚙️ Environment Setup

### 1. Create `.env` File
```bash
cp .env.example .env
```

### 2. Fill in the Required Variables

Edit `.env` with your configuration:

```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
BOT_OWNER_ID=your_discord_user_id_here

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=squadron_x_bot
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Environment
NODE_ENV=development
LOG_LEVEL=info
```

**⚠️ IMPORTANT:** Never commit `.env` to GitHub. It contains sensitive information.

## 🗄️ Database Setup

### 1. Create PostgreSQL Database
```bash
createdb squadron_x_bot
```

### 2. Run Database Schema
```bash
psql -U postgres -d squadron_x_bot -f src/database/schema.sql
```

This creates all required tables:
- `discord_users` - Discord user information
- `squadron_admins` - Admin user system
- `activity_logs` - Detailed action logging
- `server_config` - Guild-specific configuration
- `tournaments` - Tournament data (for future expansion)
- `players` - Player information
- `teams` - Team management

## 🤖 Discord Bot Setup

### Step 1: Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name: `Squadron X Esports`
4. Go to the "Bot" tab
5. Click "Add Bot"

### Step 2: Get Bot Token
1. Under "TOKEN", click "Copy"
2. Paste into `.env` as `DISCORD_TOKEN`

### Step 3: Set Bot Intents
In Developer Portal → Bot section, enable:
- ✅ Guilds
- ✅ Guild Members
- ✅ Guild Messages
- ✅ Message Content
- ✅ Direct Messages

### Step 4: Set Bot Permissions
Go to OAuth2 → URL Generator:

**Scopes:**
- `bot`
- `applications.commands`

**Permissions:**
- Manage Roles
- Manage Channels
- Send Messages
- Embed Links
- Read Message History
- Use Slash Commands

Copy the generated URL and open it to invite the bot to your server.

### Step 5: Get Guild ID
1. Enable Developer Mode in Discord (User Settings → Advanced)
2. Right-click your server and "Copy Server ID"
3. Paste into `.env` as `GUILD_ID`

### Step 6: Get Your User ID
1. Right-click yourself in Discord and "Copy User ID"
2. Paste into `.env` as `BOT_OWNER_ID`

## ▶️ Running the Bot

### Development Mode
```bash
npm run dev
```
Uses `nodemon` for auto-restart on file changes.

### Production Mode
```bash
npm start
```

You should see:
```
🚀 Squadron X Esports Bot starting...
✅ Database connected successfully
✅ Database initialized
✅ Loaded command: ping
✅ Loaded command: addadmin
...
✅ Bot logged in as Squadron X Esports#1234
🎮 Bot is ready and running in 1 guild(s)
```

## 🏗️ Architecture

### Project Structure
```
squadron-x-esports-bot/
├── src/
│   ├── commands/                 # Slash commands
│   │   ├── ping.js              # Example command
│   │   └── admin/               # Admin commands
│   │       └── addadmin.js
│   ├── events/                  # Discord events
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   ├── database/                # Database layer
│   │   ├── db.js               # Connection & queries
│   │   ├── schema.sql          # Database schema
│   │   └── models/
│   │       ├── User.js
│   │       ├── Admin.js
│   │       └── Log.js
│   ├── permissions/            # Permission system
│   │   └── permissionManager.js
│   ├── config/                 # Configuration
│   │   ├── index.js           # Main config
│   │   └── branding.js        # Branding & themes
│   ├── utils/                  # Utilities
│   │   ├── logger.js          # Logging system
│   │   └── errorHandler.js    # Error handling
│   └── index.js               # Bot entry point
├── logs/                       # Log files
├── .env                        # Environment variables (not in git)
├── .env.example               # Template for .env
├── package.json
└── README.md
```

## 🔐 Permission System

### Permission Levels

1. **Bot Owner** - Full access to everything
2. **Admin** - Configurable permissions (see below)
3. **User** - Standard Discord user

### Admin Permissions

Admins can have specific permissions:

- `tournament_management` - Manage tournaments
- `player_management` - Manage players
- `team_management` - Manage teams
- `match_management` - Manage matches
- `announcement_management` - Send announcements
- `moderation` - Moderate server
- `logs` - View activity logs
- `staff_management` - Manage staff

### Adding an Admin

Owner command:
```
/addadmin user:@User permission:tournament_management
```

## 📚 Adding New Features

### Adding a New Command

1. Create file in `src/commands/`:
```javascript
// src/commands/mycommand.js
import { SlashCommandBuilder } from 'discord.js';
import { branding } from '../config/branding.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My awesome command'),
  
  async execute(interaction) {
    const embed = {
      color: branding.colors.success,
      title: '✅ Success',
      description: 'Command executed!',
      footer: branding.embeds.footer,
      timestamp: new Date(),
    };
    await interaction.reply({ embeds: [embed] });
  },
};
```

2. Bot automatically loads it on startup

### Adding a New Event

1. Create file in `src/events/`:
```javascript
// src/events/myevent.js
export default {
  name: 'myevent',
  once: false,
  async execute(arg1, arg2, client) {
    // Handle event
  },
};
```

### Using the Database

```javascript
import { query } from '../database/db.js';

// Execute query
const result = await query(
  'SELECT * FROM discord_users WHERE discord_id = $1',
  [userId]
);

const user = result.rows[0];
```

### Using Permission System

```javascript
import { hasPermission, ADMIN_PERMISSIONS } from '../permissions/permissionManager.js';

const canManageTournaments = await hasPermission(
  userId, 
  ADMIN_PERMISSIONS.TOURNAMENT_MANAGEMENT
);
```

### Using Logging

```javascript
import logger from '../utils/logger.js';

logger.info('Admin added', { userId, admin: newAdminId });
logger.error('Something went wrong', error);
logger.warn('This is a warning', { details: 'info' });
```

## 🐛 Troubleshooting

### Bot Not Connecting
- ✓ Check `DISCORD_TOKEN` is correct
- ✓ Ensure bot has SERVER MEMBERS INTENT enabled
- ✓ Verify bot is invited to the server

### Database Connection Error
- ✓ Ensure PostgreSQL is running
- ✓ Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
- ✓ Verify database exists: `createdb squadron_x_bot`
- ✓ Run schema: `psql -U postgres -d squadron_x_bot -f src/database/schema.sql`

### Commands Not Showing Up
- ✓ Run `/deploy-commands` if you add new commands
- ✓ Ensure command files are in `src/commands/`
- ✓ Check console for load errors
- ✓ Refresh Discord (Ctrl+R)

### Permission Denied Errors
- ✓ Ensure `BOT_OWNER_ID` is set to your Discord ID
- ✓ Check database has admin user: `SELECT * FROM squadron_admins;`
- ✓ Verify admin has correct permissions

### Logs Not Creating
- ✓ Ensure `logs/` directory exists or is writable
- ✓ Check `LOG_FILE_PATH` in `.env`
- ✓ Verify disk space

## 📖 Additional Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord API Documentation](https://discord.com/developers/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a professional project. Please follow:
- Clean code standards
- Modular architecture
- Proper error handling
- Comprehensive logging
- Security best practices

---

**Squadron X Esports** - Professional BGMI Esports Management
