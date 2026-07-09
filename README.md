# Nexus Bot

All-purpose Discord bot for community servers.

## Features

- **Welcome System** - Greets new members
- **Logging System** - Logs member joins, message deletes, kicks/bans, channel creates/deletes
- **Auto Ping** - Auto-ping roles based on keywords in messages
- **Giveaway System** - Start giveaways with reactions
- **Auto Roles** - Assign roles automatically to new members

## Setup

1. Create `.env` file from `.env.example`
2. Add your bot token and client ID
3. Install dependencies: `npm install`
4. Deploy slash commands (see below)
5. Start: `npm start`

## Deployment

```bash
# Register slash commands globally (takes up to 1 hour)
node src/deploy-commands.js

# Or register to a specific guild (instant)
GUILD_ID=your_guild_id node src/deploy-commands.js
```

## Configuration

Set these environment variables in `.env`:

- `TOKEN` - Bot token from Discord Developer Portal
- `CLIENT_ID` - Application client ID
- `LOG_CHANNEL_ID` - Channel ID for logging messages
- `WELCOME_CHANNEL_ID` - Channel ID for welcome messages
- `GUILD_ID` - (Optional) Guild ID for instant command registration