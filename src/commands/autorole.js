const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'autoroles.json');

function loadAutoroles() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '{}');
    return {};
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveAutoroles(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Set up automatic role assignment')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to assign to new members')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    const autoroles = loadAutoroles();
    autoroles[interaction.guildId] = role.id;
    saveAutoroles(autoroles);

    await interaction.reply(`Autorole set! New members will receive ${role.name}`);
  }
};