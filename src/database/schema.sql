-- Discord Users
CREATE TABLE IF NOT EXISTS discord_users (
    id SERIAL PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Squadron X Admins
CREATE TABLE IF NOT EXISTS squadron_admins (
    id SERIAL PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    permission_level VARCHAR(50) DEFAULT 'admin',
    admin_permissions TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    target_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Server Configuration
CREATE TABLE IF NOT EXISTS server_config (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255) UNIQUE NOT NULL,
    log_channel_id VARCHAR(255),
    announcement_channel_id VARCHAR(255),
    tournament_category_id VARCHAR(255),
    admin_role_id VARCHAR(255),
    staff_role_id VARCHAR(255),
    player_role_id VARCHAR(255),
    team_role_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments (for future expansion)
CREATE TABLE IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning',
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players (for future expansion)
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    discord_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    in_game_name VARCHAR(255),
    guild_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams (for future expansion)
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    captain_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_discord_users_discord_id ON discord_users(discord_id);
CREATE INDEX IF NOT EXISTS idx_squadron_admins_discord_id ON squadron_admins(discord_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_server_config_guild_id ON server_config(guild_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_guild_id ON tournaments(guild_id);
CREATE INDEX IF NOT EXISTS idx_players_guild_id ON players(guild_id);
CREATE INDEX IF NOT EXISTS idx_teams_guild_id ON teams(guild_id);
