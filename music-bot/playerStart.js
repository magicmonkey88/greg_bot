const { GuildQueueEvent } = require("discord-player");
const { nowPlayingEmbed } = require("../functions/embeds");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: GuildQueueEvent.PlayerStart,
  async execute(queue, track) {
    const { channel } = queue.metadata;
    const tracks = queue.tracks.toArray();
    queue.metadata.skipVotes = new Set();
    if (queue.metadata.skipVoteTimeout) {
      clearTimeout(queue.metadata.skipVoteTimeout);
      queue.metadata.skipVoteTimeout = null;
    }

    const musicData = channel.client.musicChannel.get(channel.guildId);

    if (musicData) {
      const musicChannel = await channel.client.channels.fetch(
        musicData.channelId
      );
      const musicMessage = await musicChannel.messages.fetch(
        musicData.messageId
      );

      const skipButton = new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Skip")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⏭️");

      const components =
        tracks.length === 0
          ? []
          : [new ActionRowBuilder().addComponents(skipButton)];

      const nowPlaying = nowPlayingEmbed({ guild: channel.guild, track });

      await musicMessage.edit({
        embeds: [nowPlaying.embed],
        components,
        files: nowPlaying.files || [],
        attachments: [],
      });
    }
  },
};
