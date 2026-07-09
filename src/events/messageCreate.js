const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'autoping.json');

function loadAutopingData() {
  if (!fs.existsSync(dataPath)) return {};
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const data = loadAutopingData();
    const guildData = data[message.guild.id];
    if (!guildData) return;

    const channelConfig = guildData[message.channelId];
    if (!channelConfig) return;

    if (message.content.toLowerCase().includes(channelConfig.keyword)) {
      const role = message.guild.roles.cache.get(channelConfig.roleId);
      if (role) {
        await message.reply(`<@&${channelConfig.roleId}>`);
      }
    }
  }
};