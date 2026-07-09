# VPS Deployment Guide

## Server Setup

```bash
# SSH verbinden
ssh user@91.99.132.249

# Projekt klonen
git clone https://github.com/Kegiion/jevora-bot.git
cd jevora-bot

# PM2 installieren
sudo npm install -g pm2

# Node 18+ verwenden
nvm install 20
nvm use 20

# Dependencies
npm install

# .env erstellen
cp .env.example .env
# Werte eintragen: TOKEN, SUPABASE_URL, SUPABASE_ANON_KEY, etc.
```

## Bot Starten

```bash
pm2 start src/index.js --name jevora-bot
pm2 save
node src/deploy-commands.js GUILD_ID=deine_guild_id
```

## Dashboard

```bash
pm2 start dashboard/server.js --name jevora-dashboard

# Mit Caddy Reverse Proxy:
# dashboard.deine-domain.de {
#   reverse_proxy localhost:3000
# }
```

## Supabase

Führe `SUPABASE_SETUP.md` SQL-Befehle in Supabase aus.