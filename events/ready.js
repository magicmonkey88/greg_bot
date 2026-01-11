const { Events } = require("discord.js");
const { extractor } = require("../functions/yt-extractor");
const db = require("../database");
const guildCheck = require("../functions/guild-check");
const { defineEvent } = require("../functions/discord-helpers");

module.exports = defineEvent({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    await extractor();

    try {
      await db.sequelize.authenticate();
      await db.sequelize.sync({ alter: true });
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    guildCheck(client);
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
});
