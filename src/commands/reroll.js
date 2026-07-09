const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reroll')
    .setDescription('Reroll a giveaway')
    .addStringOption(option =>
      option.setName('message_id')
        .setDescription('The message ID of the giveaway')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('winners')
        .setDescription('Number of winners to reroll')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const winners = interaction.options.getInteger('winners') || 1;

    try {
      const message = await interaction.channel.messages.fetch(messageId);
      const reaction = message.reactions.cache.get('🎉');

      if (!reaction) {
        await interaction.reply({ content: 'No giveaway reaction found on this message.', ephemeral: true });
        return;
      }

      const users = await reaction.users.fetch();
      const participants = users.filter(u => !u.bot).values();
      const participantArray = Array.from(participants);

      if (participantArray.length === 0) {
        await interaction.reply({ content: 'No participants found.', ephemeral: true });
        return;
      }

      // Shuffle
      for (let i = participantArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participantArray[i], participantArray[j]] = [participantArray[j], participantArray[i]];
      }

      const winnerIds = participantArray.slice(0, winners);
      await interaction.reply(`🎉 New winner${winners > 1 ? 's' : ''}: ${winnerIds.map(id => `<@${id}>`).join(', ')}!`);
    } catch (error) {
      await interaction.reply({ content: 'Could not find the message. Check the ID and try again.', ephemeral: true });
    }
  }
};