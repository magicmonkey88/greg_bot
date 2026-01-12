const {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
  MessageFlags,
} = require("discord.js");
const db = require("../../database");
const {
  ensurePermissions,
  ensureAllowedGuild,
} = require("../../functions/permission-checks");
const { defineCommand } = require("../../functions/discord-helpers");
const { buildMusicSetupEmbed } = require("../../functions/embeds");

module.exports = defineCommand({
  data: new SlashCommandBuilder()
    .setName("music-setup")
    .setDescription("Sets up Greg's Bard.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction) {
    const { embed, files } = buildMusicSetupEmbed(interaction.guild);

    const guildAllowed = await ensureAllowedGuild({
      interaction,
      envVar: "MUSIC_ALLOWED_GUILDS",
      message: "Music setup is not enabled for this server.",
    });

    if (!guildAllowed) return;

    const channelPermissionsOk = await ensurePermissions({
      interaction,
      channel: interaction.channel,
      permissions: [
        {
          flag: PermissionsBitField.Flags.ViewChannel,
          label: "View Channel",
        },
        {
          flag: PermissionsBitField.Flags.SendMessages,
          label: "Send Messages",
        },
        {
          flag: PermissionsBitField.Flags.EmbedLinks,
          label: "Embed Links",
        },
      ],
    });

    if (!channelPermissionsOk) return;

    const guildPermissionsOk = await ensurePermissions({
      interaction,
      permissions: [
        {
          flag: PermissionsBitField.Flags.ManageChannels,
          label: "Manage Channels",
        },
      ],
    });

    if (!guildPermissionsOk) return;

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({
        content:
          "Please join a voice channel so I can verify voice permissions before setup.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const voicePermissionsOk = await ensurePermissions({
      interaction,
      channel: voiceChannel,
      context: "your voice channel",
      permissions: [
        {
          flag: PermissionsBitField.Flags.Connect,
          label: "Connect",
          action: "join your voice channel",
        },
        {
          flag: PermissionsBitField.Flags.Speak,
          label: "Speak",
          action: "speak",
        },
      ],
    });

    if (!voicePermissionsOk) return;

    const { Guild } = db;
    const guildDB = await Guild.findOne({ where: { id: interaction.guildId } });

    if (!guildDB.musicChannel) {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      }

      const musicChannel = await interaction.guild.channels.create({
        name: "Greg's Bard",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.EmbedLinks,
              PermissionsBitField.Flags.AttachFiles,
              PermissionsBitField.Flags.ManageMessages,
            ],
          },
          {
            id: interaction.guild.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.UseExternalEmojis,
            ],
          },
        ],
      });

      const musicEmbedMessage = await musicChannel.send({
        embeds: [embed],
        files,
      });

      await interaction.editReply({
        content: `✅ Created music channel: ${musicChannel}`,
      });

      await guildDB.update({
        musicChannel: musicChannel.id,
        musicChannelMessage: musicEmbedMessage.id,
      });

      interaction.client.musicChannel.set(interaction.guildId, {
        channelId: musicChannel.id,
        messageId: musicEmbedMessage.id,
      });
    } else {
      return interaction.reply({
        content: "A channel has already been created for Greg's Bard",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
});
