# Supabase Setup für Jevora Bot

## Tabellen erstellen

Führe diese SQL-Befehle in deinem Supabase SQL Editor aus:

```sql
-- Autoping Regeln
create table autoping (
  id bigint generated always as identity primary key,
  guild_id text not null,
  keyword text not null,
  role_id text not null,
  channel_id text not null
);

-- Autorole
create table autorole (
  guild_id text primary key,
  role_id text not null
);

-- Welcome
create table welcome (
  guild_id text primary key,
  channel_id text,
  message text default 'Willkommen {user}!'
);

-- Giveaways
create table giveaways (
  id bigint generated always as identity primary key,
  guild_id text not null,
  channel_id text not null,
  message_id text not null,
  prize text not null,
  winners int not null,
  end_time timestamp not null
);

-- Logging
create table logging (
  guild_id text primary key,
  channel_id text
);
```

## Umgebungsvariablen

In `.env`:
- `SUPABASE_URL` - Von Supabase Projekt Settings
- `SUPABASE_ANON_KEY` - Von Supabase Projekt Settings