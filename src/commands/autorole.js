const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { supabase } = require('../supabase');

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

    const { error } = await supabase.from('autorole').upsert({
      guild_id: interaction.guildId,
      role_id: role.id
    });

    if (error) {
      await interaction.reply({ content: 'Failed to save autorole!', ephemeral: true });
      return;
    }

    await interaction.reply(`Autorole set! New members will receive ${role.name}`);
  }
};