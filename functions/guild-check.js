const db = require("../database");
const { buildMusicSetupEmbed } = require("./embeds");

const guildCheck = async (client) => {
  const { Guild } = db;
  const currentGuilds = client.guilds.cache.map((g) => g.id);
  const dbGuilds = await Guild.findAll();
  const dbGuildIds = dbGuilds.map((g) => g.id);

  for (const id of currentGuilds) {
    if (!dbGuildIds.includes(id)) {
      const guild = await client.guilds.fetch(id);
      await Guild.upsert({
        id: guild.id,
        joinedAt: guild.joinedAt || new Date(),
      });
      console.log(`📥 Synced missing guild ${guild.name} (${guild.id})`);
    }
  }

  for (const id of dbGuildIds) {
    if (!currentGuilds.includes(id)) {
      await Guild.destroy({ where: { id } });
      console.log(`📤 Removed stale guild ${id} from database`);
    }
  }

  for (const guildRow of dbGuilds) {
    if (!guildRow.musicChannel) continue;

    const guild = client.guilds.cache.get(guildRow.id);
    if (!guild) continue;

    const channel = guild.channels.cache.get(guildRow.musicChannel);

    if (!channel) {
      await Guild.update(
        { musicChannel: null, musicChannelMessage: null },
        { where: { id: guildRow.id } }
      );
      client.musicChannel?.delete(guildRow.id);
      continue;
    }

    const ensureMessage = async () => {
      if (!channel.isTextBased?.()) return;

      const { embed, files } = buildMusicSetupEmbed(guild);

      if (!guildRow.musicChannelMessage) {
        const message = await channel.send({ embeds: [embed], files });
        await Guild.update(
          { musicChannelMessage: message.id },
          { where: { id: guildRow.id } }
        );
        client.musicChannel?.set(guildRow.id, {
          channelId: guildRow.musicChannel,
          messageId: message.id,
        });
        return;
      }

      try {
        const message = await channel.messages.fetch(
          guildRow.musicChannelMessage
        );
        const hasSetupEmbed = message.embeds?.some(
          (existing) => existing?.title === "Greg's Bard is Ready"
        );

        if (!hasSetupEmbed) {
          await message.edit({ embeds: [embed], files });
        }

        client.musicChannel?.set(guildRow.id, {
          channelId: guildRow.musicChannel,
          messageId: guildRow.musicChannelMessage,
        });
      } catch (error) {
        const message = await channel.send({ embeds: [embed], files });
        await Guild.update(
          { musicChannelMessage: message.id },
          { where: { id: guildRow.id } }
        );
        client.musicChannel?.set(guildRow.id, {
          channelId: guildRow.musicChannel,
          messageId: message.id,
        });
      }
    };

    await ensureMessage();
  }
};

module.exports = guildCheck;
