const { Events } = require("discord.js");
const db = require("../database");
const { defineEvent } = require("../functions/discord-helpers");
const { buildMusicSetupEmbed } = require("../functions/embeds");

module.exports = defineEvent({
  name: Events.MessageDelete,
  async execute(message) {
    if (!message.guildId) return;

    const musicData = message.client.musicChannel.get(message.guildId);
    if (!musicData || musicData.messageId !== message.id) return;

    const channel =
      message.channel ||
      (await message.client.channels.fetch(musicData.channelId));

    if (!channel || !channel.isTextBased?.()) return;

    const { embed, files } = buildMusicSetupEmbed(channel.guild);

    try {
      const newMessage = await channel.send({ embeds: [embed], files });
      await db.Guild.update(
        { musicChannelMessage: newMessage.id },
        { where: { id: message.guildId } }
      );
      message.client.musicChannel.set(message.guildId, {
        channelId: musicData.channelId,
        messageId: newMessage.id,
      });
    } catch (error) {
      console.error("Failed to restore music message:", error);
    }
  },
});
