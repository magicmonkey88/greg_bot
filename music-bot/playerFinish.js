const { GuildQueueEvent } = require("discord-player");
const { buildMusicSetupEmbed } = require("../functions/embeds");

module.exports = {
  name: GuildQueueEvent.PlayerFinish,
  async execute(queue, track) {
    const { channel } = queue.metadata;

    const musicData = channel.client.musicChannel.get(channel.guildId);

    if (musicData) {
      const musicChannel = await channel.client.channels.fetch(
        musicData.channelId
      );
      const musicMessage = await musicChannel.messages.fetch(
        musicData.messageId
      );

      const { embed, files } = buildMusicSetupEmbed(channel.guild);

      await musicMessage.edit({
        embeds: [embed],
        files,
        attachments: [],
      });
    }
  },
};
