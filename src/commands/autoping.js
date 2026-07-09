const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { supabase } = require('../supabase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoping')
    .setDescription('Set up auto-ping for this channel')
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('Keyword to trigger ping')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to ping')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const keyword = interaction.options.getString('keyword').toLowerCase();
    const role = interaction.options.getRole('role');

    const { error } = await supabase.from('autoping').insert({
      guild_id: interaction.guildId,
      channel_id: interaction.channelId,
      keyword,
      role_id: role.id
    });

    if (error) {
      await interaction.reply({ content: 'Failed to save autoping rule!', ephemeral: true });
      return;
    }

    await interaction.reply(`Auto-ping configured! Messages containing "${keyword}" will ping ${role.name}`);
  }
};