const { supabase } = require('./supabase');

let client;
let checkInterval;

function start(clientInstance) {
  client = clientInstance;

  // Check every minute for ended giveaways
  checkInterval = setInterval(async () => {
    const now = new Date().toISOString();
    const { data: endedGiveaways } = await supabase
      .from('giveaways')
      .select('*')
      .lt('end_time', now);

    for (const giveaway of endedGiveaways || []) {
      await endGiveaway(giveaway);
    }
  }, 60000);
}

async function endGiveaway(giveaway) {
  const channel = await client.channels.fetch(giveaway.channel_id).catch(() => null);
  if (!channel) return;

  try {
    const message = await channel.messages.fetch(giveaway.message_id);
    const reaction = message.reactions.cache.get('🎉');

    if (reaction && reaction.count > 0) {
      const users = await reaction.users.fetch();
      const participants = users.filter(u => !u.bot).values();
      const participantArray = Array.from(participants);

      if (participantArray.length > 0) {
        // Shuffle
        for (let i = participantArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [participantArray[i], participantArray[j]] = [participantArray[j], participantArray[i]];
        }

        const winners = participantArray.slice(0, giveaway.winners);
        await channel.send(`🎉 Congratulations ${winners.map(w => `<@${w.id}>`).join(', ')}! You won: **${giveaway.prize}**`);
      } else {
        await channel.send('No valid participants.');
      }
    }

    await supabase.from('giveaways').delete().eq('id', giveaway.id);
  } catch (error) {
    console.error('Giveaway error:', error);
  }
}

module.exports = { start };