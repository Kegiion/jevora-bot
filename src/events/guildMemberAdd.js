const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const autorolesPath = path.join(__dirname, '..', 'data', 'autoroles.json');
const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;

function loadAutoroles() {
  if (!fs.existsSync(autorolesPath)) return {};
  return JSON.parse(fs.readFileSync(autorolesPath, 'utf8'));
}

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // Welcome message
    if (welcomeChannelId) {
      const channel = member.guild.channels.cache.get(welcomeChannelId);
      if (channel) {
        await channel.send({
          content: `Willkommen ${member}! 👋 Schau dich um und habe Spaß!`,
          allowedMentions: { users: [member.id] }
        });
      }
    }

    // Auto role
    const autoroles = loadAutoroles();
    const roleId = autoroles[member.guild.id];

    if (roleId) {
      const role = member.guild.roles.cache.get(roleId);
      if (role) {
        await member.roles.add(role);
      }
    }
  }
};