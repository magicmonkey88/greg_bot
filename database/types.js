/**
 * @typedef {Object} GuildAttributes
 * @property {string} id
 * @property {string | null} musicChannel
 * @property {string | null} musicChannelMessage
 * @property {Date | null} joinedAt
 */

/**
 * @typedef {import("sequelize").Model<GuildAttributes> & GuildAttributes} GuildModel
 */

/**
 * @typedef {Object} DbModels
 * @property {import("sequelize").ModelStatic<GuildModel>} Guild
 */

module.exports = {};
