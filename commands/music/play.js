const {
  SlashCommandBuilder,
  PermissionsBitField,
  MessageFlags,
} = require("discord.js");
const { useMainPlayer } = require("discord-player");
const {
  ensurePermissions,
  ensureAllowedGuild,
} = require("../../functions/permission-checks");
const { defineCommand } = require("../../functions/discord-helpers");
const { buildSongEmbed } = require("../../functions/embeds");

module.exports = defineCommand({
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song!")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { guild } = interaction;
    const player = useMainPlayer();
    const query = interaction.options.getString("song", true);
    const voiceChannel = interaction.member.voice.channel;

    const guildAllowed = await ensureAllowedGuild({
      interaction,
      envVar: "MUSIC_ALLOWED_GUILDS",
      message: "Music commands are not enabled for this server.",
    });

    if (!guildAllowed) return;

    if (!voiceChannel) {
      return interaction.reply({
        content: "You need to be in a voice channel to play music!",
        flags: MessageFlags.Ephemeral,
      });
    }

    const channelPermissionsOk = await ensurePermissions({
      interaction,
      channel: interaction.channel,
      permissions: [
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

    if (
      interaction.guild.members.me.voice.channel &&
      interaction.guild.members.me.voice.channel !== voiceChannel
    ) {
      return interaction.reply({
        content: "I am already playing in a different voice channel!",
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

    const musicChannelCheck = interaction.client.musicChannel.get(
      interaction.guildId
    );

    if (!musicChannelCheck) {
      return interaction.reply({
        content:
          "Music has not been set up in this server yet.\n Please ask an Administrator to run the /music-setup command.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!voicePermissionsOk) return;

    let parsedUrl;
    try {
      parsedUrl = new URL(query);
    } catch (error) {
      return interaction.reply({
        content: "Please provide a Spotify or YouTube link.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
    const allowedHosts = new Set([
      "open.spotify.com",
      "spotify.link",
      "youtube.com",
      "m.youtube.com",
      "music.youtube.com",
      "youtu.be",
    ]);

    if (!allowedHosts.has(hostname)) {
      return interaction.reply({
        content: "Only Spotify or YouTube links are supported for /play.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      }

      const result = await player.play(voiceChannel, query, {
        nodeOptions: {
          metadata: { channel: interaction.channel },
        },
      });

      const songEmbed = buildSongEmbed({ guild, track: result.track });

      if (interaction.deferred || interaction.replied) {
        return interaction.editReply({
          embeds: [songEmbed.embed],
          files: songEmbed.files || [],
        });
      }

      return interaction.reply({
        embeds: [songEmbed.embed],
        files: songEmbed.files || [],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) {
        return interaction.editReply({
          content: "An error occurred while playing the song!",
        });
      }

      return interaction.reply({
        content: "An error occurred while playing the song!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
});
