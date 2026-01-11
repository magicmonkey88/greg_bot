const { GuildQueueEvent } = require("discord-player");
const { nowPlayingEmbed } = require("../functions/embeds");

module.exports = {
  name: GuildQueueEvent.PlayerStart,
  async execute(queue, track) {
    const { channel } = queue.metadata;
    // await channel.send(`Now playing: ${track.title}`);
    const musicData = channel.client.musicChannel.get(channel.guildId);

    if (musicData) {
      const musicChannel = await channel.client.channels.fetch(
        musicData.channelId
      );
      const musicMessage = await musicChannel.messages.fetch(
        musicData.messageId
      );

      await musicMessage.edit({
        embeds: [nowPlayingEmbed({ guild: channel.guild, track })],
        attachments: [],
      });
    }
  },
};
