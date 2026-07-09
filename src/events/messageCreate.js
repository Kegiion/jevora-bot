const { Events } = require('discord.js');
const { supabase } = require('../supabase');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const { data: autopings } = await supabase
      .from('autoping')
      .select('*')
      .eq('guild_id', message.guild.id)
      .eq('channel_id', message.channelId);

    for (const rule of autopings || []) {
      if (message.content.toLowerCase().includes(rule.keyword)) {
        const role = message.guild.roles.cache.get(rule.role_id);
        if (role) {
          await message.reply(`<@&${rule.role_id}>`);
        }
      }
    }
  }
};