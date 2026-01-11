const { useMainPlayer } = require("discord-player");
const { SpotifyExtractor } = require("discord-player-spotify");
const { YoutubeExtractor } = require("discord-player-youtube");

const extractor = async () => {
  const player = useMainPlayer();

  await player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    player_id: player.id,
  });

  await player.extractors.register(YoutubeExtractor, {
    cookie: process.env.YT_COOKIE,
    filterAutoplayTracks: true, // enabled by default
    disableYTJSLog: true, // silence youtubei.js logs
    streamOptions: {
      useClient: "WEB_EMBEDDED",
    },
  });
};

module.exports = { extractor };
