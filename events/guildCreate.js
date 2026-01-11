const { Events } = require("discord.js");
const db = require("../database");
const { defineEvent } = require("../functions/discord-helpers");

module.exports = defineEvent({
  name: Events.GuildCreate,
  async execute(guild) {
    const { Guild } = db;

    try {
      await Guild.upsert({
        id: guild.id,
        joinedAt: guild.joinedAt || new Date(),
      });
      console.log(`✅ Added or updated guild ${guild.name} (${guild.id})`);
    } catch (error) {
      console.error("Error during guildCreate:", error);
    }
  },
});
