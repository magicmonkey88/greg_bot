const { MessageFlags } = require("discord.js");

const ensurePermissions = async ({
  interaction,
  channel,
  permissions,
}) => {
  const botMember = interaction.guild.members.me;
  const permissionsSource = channel
    ? botMember.permissionsIn(channel)
    : botMember.permissions;

  for (const permission of permissions) {
    if (!permissionsSource.has(permission.flag)) {
      const label = permission.label || "the required permission";
      const content =
        permission.message ||
        `I do not have permission to ${
          permission.action || label.toLowerCase()
        }${channel ? ` in ${channel.name}` : ""}.\n Please enable \`${
          label
        }\` for me!`;

      await interaction.reply({
        content,
        flags: MessageFlags.Ephemeral,
      });
      return false;
    }
  }

  return true;
};

const ensureAllowedGuild = async ({ interaction, envVar, message }) => {
  const raw = process.env[envVar] || "";
  const allowedGuilds = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!allowedGuilds.length || !allowedGuilds.includes(interaction.guildId)) {
    await interaction.reply({
      content:
        message ||
        "This command is not enabled for this server. Please enable it for this guild first.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }

  return true;
};

module.exports = { ensurePermissions, ensureAllowedGuild };
