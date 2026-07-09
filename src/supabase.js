const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getGuildConfig(guildId, table) {
  const { data, error } = await supabase.from(table).select('*').eq('guild_id', guildId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function setGuildConfig(guildId, table, config) {
  const { data, error } = await supabase.from(table).upsert({ guild_id: guildId, ...config });
  if (error) throw error;
  return data;
}

module.exports = { supabase, getGuildConfig, setGuildConfig };