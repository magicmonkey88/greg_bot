const { Events } = require("discord.js");
const db = require("../database");
const { defineEvent } = require("../functions/discord-helpers");

module.exports = defineEvent({
  name: Events.ChannelDelete,
  async execute(channel) {
    const { Guild } = db;
    const dbmusicChannel = await Guild.findOne({
      where: { id: channel.guildId },
    });
    if (dbmusicChannel && dbmusicChannel.musicChannel === channel.id) {
      await Guild.update(
        { musicChannel: null, musicChannelMessage: null },
        { where: { id: channel.guildId } }
      );
      channel.client.musicChannel?.delete(channel.guildId);
      return;
    }
  },
});
