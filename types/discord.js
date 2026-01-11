/**
 * @typedef {import("discord.js").ChatInputCommandInteraction} ChatInputCommandInteraction
 * @typedef {import("discord.js").SlashCommandBuilder} SlashCommandBuilder
 * @typedef {import("discord.js").Interaction} Interaction
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("discord.js").Guild} Guild
 * @typedef {import("discord.js").Channel} Channel
 */

/**
 * @typedef {Object} CommandModule
 * @property {SlashCommandBuilder} data
 * @property {(interaction: ChatInputCommandInteraction) => Promise<void>} execute
 */

/**
 * @typedef {Object} ReadyEvent
 * @property {import("discord.js").Events.ClientReady} name
 * @property {boolean=} once
 * @property {(client: Client) => Promise<void>} execute
 */

/**
 * @typedef {Object} InteractionCreateEvent
 * @property {import("discord.js").Events.InteractionCreate} name
 * @property {(interaction: Interaction) => Promise<void>} execute
 */

/**
 * @typedef {Object} GuildCreateEvent
 * @property {import("discord.js").Events.GuildCreate} name
 * @property {(guild: Guild) => Promise<void>} execute
 */

/**
 * @typedef {Object} GuildDeleteEvent
 * @property {import("discord.js").Events.GuildDelete} name
 * @property {(guild: Guild) => Promise<void>} execute
 */

/**
 * @typedef {Object} GuildDeleteEvent
 * @property {import("discord.js").Events.GuildDelete} name
 * @property {(guild: Guild) => Promise<void>} execute
 */

/**
 * @typedef {Object} ChannelDeleteEvent
 * @property {import("discord.js").Events.ChannelDelete} name
 * @property {(channel: Channel) => Promise<void>} execute
 */

module.exports = {};
