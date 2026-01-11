require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Player } = require("discord-player");
const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} = require("discord.js");

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const allowedMusicGuilds = (process.env.MUSIC_ALLOWED_GUILDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});
const player = new Player(client);
const deployCommands = [];
const guildOnlyCommands = [];
const guildOnlyNames = new Set(["music-setup", "test-music"]);

client.commands = new Collection();
client.musicChannel = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      if (guildOnlyNames.has(command.data.name)) {
        guildOnlyCommands.push(command.data.toJSON());
      } else {
        deployCommands.push(command.data.toJSON());
      }
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${deployCommands.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: deployCommands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );

    if (allowedMusicGuilds.length && guildOnlyCommands.length) {
      for (const guildId of allowedMusicGuilds) {
        const guildData = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: guildOnlyCommands }
        );

        console.log(
          `Successfully reloaded ${guildData.length} guild (/) commands for ${guildId}.`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const musicEventsPath = path.join(__dirname, "music-bot");
const musicEventFiles = fs
  .readdirSync(musicEventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of musicEventFiles) {
  const filePath = path.join(musicEventsPath, file);
  const event = require(filePath);
  player.events.on(event.name, (...args) => event.execute(...args));
}

client.login(token);
