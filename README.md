# Jevora Bot

All-purpose Discord bot for community servers with web dashboard.

## Features

- **Welcome System** - Greets new members with custom messages
- **Logging System** - Logs kicks/bans, message deletes, channel creates/deletes
- **Auto Ping** - Auto-ping roles based on keywords in messages
- **Giveaway System** - Start giveaways with reactions
- **Auto Roles** - Assign roles automatically to new members
- **Web Dashboard** - Configure all settings via web UI (EJS + Tailwind)

## Setup

1. **Supabase Setup** - Führe die SQL-Befehle aus `SUPABASE_SETUP.md` aus
2. **Environment** - Erstelle `.env` von `.env.example` und fülle die Werte aus
3. **Install** - `npm install`
4. **Deploy commands** - `node src/deploy-commands.js` (mit GUILD_ID für sofortige Registrierung)
5. **Start Bot** - `npm start`
6. **Start Dashboard** - `node dashboard/server.js`

## Environment Variables

- `TOKEN` - Bot token from Discord Developer Portal
- `CLIENT_ID` - Application client ID
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SESSION_SECRET` - Random string für Session-Cookies
- `DASHBOARD_URL` - URL des Dashboards (z.B. `http://localhost:3000`)
- `DISCORD_CLIENT_ID` - Für OAuth (gleiche wie CLIENT_ID)
- `DISCORD_CLIENT_SECRET` - Bot Secret von Discord

## Commands

- `/welcome` - Willkommensnachricht setzen (über Dashboard)
- `/autorole` - Auto-Rolle für neue Member
- `/autoping <keyword> <role>` - Auto-Ping-Regel erstellen
- `/giveaway <prize> <duration> <winners>` - Giveaway starten
- `/reroll <message_id>` - Giveaway neu ziehen