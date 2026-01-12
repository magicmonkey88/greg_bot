const { useMainPlayer } = require("discord-player");
const { Events, MessageFlags } = require("discord.js");
const { defineEvent } = require("../functions/discord-helpers");

module.exports = defineEvent({
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    const player = useMainPlayer();

    try {
      await player.context.provide({ guild: interaction.guild }, () =>
        command.execute(interaction)
      );
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
});
