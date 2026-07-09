const { Events, AuditLogEvent } = require('discord.js');

module.exports = {
  name: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild) {
    const channelId = process.env.LOG_CHANNEL_ID;
    const channel = guild.channels.cache.get(channelId);

    if (!channel) return;

    const { actionType, target, executor } = auditLogEntry;
    let logMessage;

    switch (actionType) {
      case AuditLogEvent.MessageDelete:
        logMessage = `🗑️ Nachricht gelöscht von ${executor?.tag || 'Unbekannt'} in #${target?.channel?.name || 'Unbekannt'}`;
        break;
      case AuditLogEvent.MessageBulkDelete:
        logMessage = `🗑️ Mehrere Nachrichten gelöscht`;
        break;
      case AuditLogEvent.MemberKick:
        logMessage = `👢 ${target?.tag} wurde gekickt von ${executor?.tag}`;
        break;
      case AuditLogEvent.MemberBanAdd:
        logMessage = `🔨 ${target?.tag} wurde gebannt von ${executor?.tag}`;
        break;
      case AuditLogEvent.MemberBanRemove:
        logMessage = `✅ ${target?.tag} wurde entbannt von ${executor?.tag}`;
        break;
      case AuditLogEvent.ChannelCreate:
        logMessage = `📁 Channel ${target?.name} wurde erstellt von ${executor?.tag}`;
        break;
      case AuditLogEvent.ChannelDelete:
        logMessage = `🗑️ Channel ${target?.name} wurde gelöscht von ${executor?.tag}`;
        break;
      default:
        return;
    }

    await channel.send(logMessage);
  }
};