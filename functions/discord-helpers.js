/**
 * @param {import("../types/discord").CommandModule} command
 * @returns {import("../types/discord").CommandModule}
 */
const defineCommand = (command) => command;

/**
 * @param {import("../types/discord").InteractionCreateEvent | import("../types/discord").ReadyEvent | import("../types/discord").GuildCreateEvent | import("../types/discord").GuildDeleteEvent | import("../types/discord").ChannelDeleteEvent} event
 * @returns {import("../types/discord").InteractionCreateEvent | import("../types/discord").ReadyEvent | import("../types/discord").GuildCreateEvent | import("../types/discord").GuildDeleteEvent | import("../types/discord").ChannelDeleteEvent}
 */
const defineEvent = (event) => event;

module.exports = { defineCommand, defineEvent };
