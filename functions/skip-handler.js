const { useQueue } = require("discord-player");
const { MessageFlags, PermissionFlagsBits } = require("discord.js");

const handleSkipButton = async (interaction) => {
  const queue = useQueue(interaction.guildId);

  if (!queue || !queue.currentTrack) {
    return interaction.reply({
      content: "There is nothing playing right now.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const voiceChannel = interaction.member.voice?.channel;
  if (!voiceChannel || queue.channel?.id !== voiceChannel.id) {
    return interaction.reply({
      content: "You need to be in my voice channel to vote to skip.",
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.deferUpdate();

  const musicData = interaction.client.musicChannel.get(interaction.guildId);
  const musicChannel = musicData
    ? await interaction.client.channels.fetch(musicData.channelId)
    : null;
  const announce = async (content) => {
    if (musicChannel?.isTextBased?.()) {
      let message = null;
      const existingId = queue.metadata.skipAnnouncementId;
      if (existingId) {
        try {
          message = await musicChannel.messages.fetch(existingId);
          await message.edit({ content });
        } catch (error) {
          message = null;
        }
      }

      if (!message) {
        message = await musicChannel.send({ content });
        queue.metadata.skipAnnouncementId = message.id;
      }

      if (queue.metadata.skipAnnouncementTimeout) {
        clearTimeout(queue.metadata.skipAnnouncementTimeout);
      }

      const holdMs = queue.metadata.skipVoteTimeout ? 70000 : 10000;
      queue.metadata.skipAnnouncementTimeout = setTimeout(() => {
        message
          .delete()
          .catch(() => {})
          .finally(() => {
            if (queue.metadata.skipAnnouncementId === message.id) {
              queue.metadata.skipAnnouncementId = null;
            }
          });
      }, holdMs);
    }
  };

  if (interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
    queue.metadata.skipVotes = new Set();
    await queue.node.skip();
    await announce("⏭️ Skipped by an administrator.");
    return;
  }

  const skipVotes = queue.metadata.skipVotes || new Set();
  if (skipVotes.has(interaction.user.id)) {
    await announce(`${interaction.user} has already voted to skip.`);
    return;
  }

  if (!queue.metadata.skipVoteTimeout) {
    queue.metadata.skipVoteTimeout = setTimeout(async () => {
      const currentVotes = queue.metadata.skipVotes || new Set();
      queue.metadata.skipVotes = new Set();
      queue.metadata.skipVoteTimeout = null;
      if (currentVotes.size > 0) {
        await announce("⏭️ Vote failed. Time expired.");
      }
    }, 60000);
  }

  skipVotes.add(interaction.user.id);
  queue.metadata.skipVotes = skipVotes;

  const eligibleMembers = voiceChannel.members.filter(
    (member) =>
      !member.user.bot &&
      !member.permissions.has(PermissionFlagsBits.Administrator)
  );
  const requiredVotes = Math.max(1, Math.ceil(eligibleMembers.size * 0.8));

  if (skipVotes.size >= requiredVotes) {
    queue.metadata.skipVotes = new Set();
    if (queue.metadata.skipVoteTimeout) {
      clearTimeout(queue.metadata.skipVoteTimeout);
      queue.metadata.skipVoteTimeout = null;
    }
    await queue.node.skip();
    await announce("⏭️ Vote passed. Skipped.");
    return;
  }

  await announce(`⏭️ Vote to skip: ${skipVotes.size}/${requiredVotes}`);
};

module.exports = { handleSkipButton };
