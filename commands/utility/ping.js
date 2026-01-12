const { SlashCommandBuilder } = require("discord.js");
const { defineCommand } = require("../../functions/discord-helpers");

module.exports = defineCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
});
