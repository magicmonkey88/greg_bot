const {
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");
const getRandomCat = require("random-cat-img");
const { ensurePermissions } = require("../../functions/permission-checks");
const { defineCommand } = require("../../functions/discord-helpers");
const { buildRandomCatEmbed } = require("../../functions/embeds");

module.exports = defineCommand({
  data: new SlashCommandBuilder()
    .setName("random-cat")
    .setDescription("Provides an Image of a Random Cat."),
  async execute(interation) {
    const { member, guild } = interation;
    const channelPermissionsOk = await ensurePermissions({
      interaction: interation,
      channel: interation.channel,
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

    const RandomCatImage = await getRandomCat();
    await interation.reply({
      embeds: [
        buildRandomCatEmbed({
          guild,
          member,
          imageUrl: RandomCatImage.message,
        }),
      ],
    });
  },
});
