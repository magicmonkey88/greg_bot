const { Events } = require("discord.js");
const db = require("../database");
const { defineEvent } = require("../functions/discord-helpers");

module.exports = defineEvent({
  name: Events.GuildDelete,
  async execute(guild) {
    const { Guild } = db;

    try {
      await Guild.destroy({ where: { id: guild.id } });
      console.log(`🗑️ Removed guild ${guild.id} from database`);
    } catch (error) {
      console.error("Error during guildDelete:", error);
    }
  },
});
