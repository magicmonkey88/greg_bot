const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const attachment = new AttachmentBuilder("./images/Greg_Music.png");

const buildMusicSetupEmbed = (guild) => {
  const embed = new EmbedBuilder()
    .setColor("DarkPurple")
    .setTitle("Greg's Bard is Ready")
    .setDescription("Use `/play` to queue a song.")
    .setImage("attachment://Greg_Music.png")
    .setTimestamp()
    .setFooter({
      text: guild.name,
      iconURL: guild.iconURL(),
    });

  return { embed, files: [attachment] };
};

const buildSongEmbed = ({ guild, track }) => {
  const safeTrack = track || {};
  const title = safeTrack.title || "Unknown track";
  const author = safeTrack.author || "Unknown artist";
  const thumbnail = safeTrack.thumbnail;
  const duration = safeTrack.duration || "Unknown";

  const embed = new EmbedBuilder()
    .setColor("DarkPurple")
    .setTitle("Greg's Bard")
    .setDescription(`**${title}** has been added to the queue!`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "**Title**:", value: title, inline: true },
      { name: "**Author**:", value: author, inline: true },
      { name: "**Duration**:", value: duration }
    )
    .setTimestamp()
    .setFooter({ text: guild.name, iconURL: guild.iconURL() });

  if (thumbnail) {
    embed.setImage(thumbnail);
    return { embed };
  }

  embed.setImage("attachment://Greg_Music.png");
  return { embed, files: [attachment] };
};

const nowPlayingEmbed = ({ guild, track }) => {
  const safeTrack = track || {};
  const title = safeTrack.title || "Unknown track";
  const author = safeTrack.author || "Unknown artist";
  const thumbnail = safeTrack.thumbnail;
  const duration = safeTrack.duration || "Unknown";

  const embed = new EmbedBuilder()
    .setColor("DarkPurple")
    .setTitle("Greg's Bard")
    .setDescription(`**${title}** is now playing!`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "**Title**:", value: title, inline: true },
      { name: "**Author**:", value: author, inline: true },
      { name: "**Duration**:", value: duration }
    )
    .setTimestamp()
    .setFooter({ text: guild.name, iconURL: guild.iconURL() });

  if (thumbnail) {
    embed.setImage(thumbnail);
    return { embed };
  }

  embed.setImage("attachment://Greg_Music.png");
  return { embed, files: [attachment] };
};

const buildRandomCatEmbed = ({ guild, member, imageUrl }) => {
  return new EmbedBuilder()
    .setColor("Orange")
    .setTitle("Random Cat")
    .setAuthor({
      name: `Requested by ${member.displayName}`,
      iconURL: member.displayAvatarURL(),
    })
    .setThumbnail(guild.iconURL())
    .setImage(imageUrl)
    .setTimestamp()
    .setFooter({ text: guild.name, iconURL: guild.iconURL() });
};

module.exports = {
  buildMusicSetupEmbed,
  buildSongEmbed,
  nowPlayingEmbed,
  buildRandomCatEmbed,
};
