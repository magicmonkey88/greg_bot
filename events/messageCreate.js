const { Events } = require("discord.js");
const { defineEvent } = require("../functions/discord-helpers");

module.exports = defineEvent({
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.guild || message.author.bot) return;

    const musicData = message.client.musicChannel.get(message.guildId);
    if (!musicData || musicData.channelId !== message.channelId) return;

    try {
      await message.delete();
    } catch (error) {
      console.error("Failed to delete message in music channel:", error);
    }
  },
});
