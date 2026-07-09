const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'autoping.json');

function loadAutopingData() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '{}');
    return {};
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveAutopingData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoping')
    .setDescription('Set up auto-ping for this channel')
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('Keyword to trigger ping')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('role')
        .setDescription('Role to ping (mention or ID)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const keyword = interaction.options.getString('keyword').toLowerCase();
    const roleInput = interaction.options.getString('role');

    let roleId;
    if (roleInput.startsWith('<@&') && roleInput.endsWith('>')) {
      roleId = roleInput.slice(3, -1);
    } else {
      roleId = roleInput;
    }

    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) {
      await interaction.reply({ content: 'Role not found!', ephemeral: true });
      return;
    }

    const data = loadAutopingData();
    if (!data[interaction.guildId]) data[interaction.guildId] = {};
    data[interaction.guildId][interaction.channelId] = { keyword, roleId };
    saveAutopingData(data);

    await interaction.reply(`Auto-ping configured! Messages containing "${keyword}" will ping ${role.name}`);
  }
};