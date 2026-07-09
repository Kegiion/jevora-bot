const { Events } = require('discord.js');
const { getGuildConfig } = require('../supabase');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // Welcome message from Supabase
    const welcome = await getGuildConfig(member.guild.id, 'welcome');
    if (welcome?.channel_id) {
      const channel = member.guild.channels.cache.get(welcome.channel_id);
      if (channel) {
        const message = welcome.message?.replace('{user}', `<@${member.id}>`) || `Willkommen ${member}!`;
        await channel.send(message);
      }
    }

    // Auto role from Supabase
    const autorole = await getGuildConfig(member.guild.id, 'autorole');
    if (autorole?.role_id) {
      const role = member.guild.roles.cache.get(autorole.role_id);
      if (role) {
        await member.roles.add(role);
      }
    }
  }
};