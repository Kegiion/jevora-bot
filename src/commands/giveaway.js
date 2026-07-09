const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { supabase } = require('../supabase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Start a giveaway')
    .addStringOption(option =>
      option.setName('prize')
        .setDescription('Prize to giveaway')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('winners')
        .setDescription('Number of winners')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const prize = interaction.options.getString('prize');
    const duration = interaction.options.getInteger('duration');
    const winners = interaction.options.getInteger('winners');

    const embed = new EmbedBuilder()
      .setTitle('🎉 Giveaway Started!')
      .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Duration:** ${duration} minutes`)
      .addFields({ name: 'How to enter', value: 'React with 🎉 to participate!' })
      .setTimestamp();

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    await message.react('🎉');

    const endTime = new Date(Date.now() + duration * 60000).toISOString();

    await supabase.from('giveaways').insert({
      guild_id: interaction.guildId,
      channel_id: interaction.channelId,
      message_id: message.id,
      prize,
      winners,
      end_time: endTime
    });
  }
};