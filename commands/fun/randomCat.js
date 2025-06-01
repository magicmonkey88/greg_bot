const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
} = require("discord.js");
const getRandomCat = require("random-cat-img");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-cat")
    .setDescription("Provides an Image of a Random Cat."),
  /**
   *
   * @param {CommandInteraction} interation
   */
  async execute(interation) {
    const { member, guild } = interation;
    const RandomCatImage = await getRandomCat();
    const catEmbed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("Random Cat")
      .setAuthor({
        name: `Requested by ${member.displayName}`,
        iconURL: member.displayAvatarURL(),
      })
      .setThumbnail(guild.iconURL())
      .setImage(RandomCatImage.message)
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL() });

    await interation.reply({ embeds: [catEmbed] });
  },
};
