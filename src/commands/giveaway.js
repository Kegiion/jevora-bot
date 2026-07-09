const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'giveaways.json');

function loadGiveaways() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '{}');
    return {};
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveGiveaways(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

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

    const giveaways = loadGiveaways();
    const giveawayId = `${interaction.id}-${Date.now()}`;

    const embed = new EmbedBuilder()
      .setTitle('🎉 Giveaway Started!')
      .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Duration:** ${duration} minutes`)
      .addFields({ name: 'How to enter', value: 'React with 🎉 to participate!' })
      .setTimestamp();

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    await message.react('🎉');

    giveaways[giveawayId] = {
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      messageId: message.id,
      prize,
      winners,
      endTime: Date.now() + duration * 60000
    };
    saveGiveaways(giveaways);

    // Schedule end
    setTimeout(async () => {
      endGiveaway(giveawayId, interaction.client);
    }, duration * 60000);
  }
};

async function endGiveaway(giveawayId, client) {
  const giveaways = loadGiveaways();
  const giveaway = giveaways[giveawayId];

  if (!giveaway) return;

  const channel = await client.channels.fetch(giveaway.channelId);
  if (!channel) return;

  try {
    const message = await channel.messages.fetch(giveaway.messageId);
    const reaction = message.reactions.cache.get('🎉');

    if (reaction && reaction.count > 0) {
      const users = await reaction.users.fetch();
      const participants = users.filter(u => !u.bot).values();
      const participantArray = Array.from(participants);

      if (participantArray.length > 0) {
        // Shuffle for random winners
        for (let i = participantArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [participantArray[i], participantArray[j]] = [participantArray[j], participantArray[i]];
        }

        const winnerIds = participantArray.slice(0, giveaway.winners);
        await channel.send(`🎉 Congratulations ${winnerIds.map(id => `<@${id}>`).join(', ')}! You won: **${giveaway.prize}**`);
      } else {
        await channel.send('No valid participants for this giveaway.');
      }
    } else {
      await channel.send('This giveaway has no participants.');
    }

    delete giveaways[giveawayId];
    saveGiveaways(giveaways);
  } catch (error) {
    console.error('Failed to end giveaway:', error);
  }
}