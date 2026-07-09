const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Autoping
router.get('/autoping/:guildId', async (req, res) => {
  const { data, error } = await supabase.from('autoping').select('*').eq('guild_id', req.params.guildId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

router.post('/autoping/:guildId', async (req, res) => {
  const { keyword, role_id, channel_id } = req.body;
  const { data, error } = await supabase.from('autoping').insert({
    guild_id: req.params.guildId,
    keyword,
    role_id,
    channel_id
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/autoping/:id', async (req, res) => {
  const { error } = await supabase.from('autoping').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Autorole
router.get('/autorole/:guildId', async (req, res) => {
  const { data, error } = await supabase.from('autorole').select('*').eq('guild_id', req.params.guildId).single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  res.json(data || { role_id: null });
});

router.post('/autorole/:guildId', async (req, res) => {
  const { role_id } = req.body;
  const { data, error } = await supabase.from('autorole').upsert({
    guild_id: req.params.guildId,
    role_id
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Welcome
router.get('/welcome/:guildId', async (req, res) => {
  const { data, error } = await supabase.from('welcome').select('*').eq('guild_id', req.params.guildId).single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  res.json(data || { channel_id: null, message: 'Willkommen {user}!' });
});

router.post('/welcome/:guildId', async (req, res) => {
  const { channel_id, message } = req.body;
  const { data, error } = await supabase.from('welcome').upsert({
    guild_id: req.params.guildId,
    channel_id,
    message
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Logging
router.get('/logging/:guildId', async (req, res) => {
  const { data, error } = await supabase.from('logging').select('*').eq('guild_id', req.params.guildId).single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  res.json(data || { channel_id: null });
});

router.post('/logging/:guildId', async (req, res) => {
  const { channel_id } = req.body;
  const { data, error } = await supabase.from('logging').upsert({
    guild_id: req.params.guildId,
    channel_id
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Giveaways
router.get('/giveaways/:guildId', async (req, res) => {
  const { data, error } = await supabase.from('giveaways').select('*').eq('guild_id', req.params.guildId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

module.exports = router;