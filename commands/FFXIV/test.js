const {
  SlashCommandBuilder,
  MessageFlags,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const { character } = require("../../API/ffxiv");
const charTest = require("../../character.json");
const Canvas = require("@napi-rs/canvas");
const { request } = require("undici");
const { ensurePermissions } = require("../../functions/permission-checks");
const { defineCommand } = require("../../functions/discord-helpers");

module.exports = defineCommand({
  data: new SlashCommandBuilder().setName("test-ffxiv").setDescription("Test!"),
  async execute(interaction) {
    const channelPermissionsOk = await ensurePermissions({
      interaction,
      channel: interaction.channel,
      permissions: [
        {
          flag: PermissionsBitField.Flags.SendMessages,
          label: "Send Messages",
        },
        {
          flag: PermissionsBitField.Flags.AttachFiles,
          label: "Attach Files",
        },
      ],
    });

    if (!channelPermissionsOk) return;

    // const char = await character("26123781");
    if (charTest) {
      const { Character, ClassJobs } = charTest;
      const { Portrait, Name } = Character;
      // console.log(Character);

      const canvas = Canvas.createCanvas(1920, 1080);
      const context = canvas.getContext("2d");
      const background = await Canvas.loadImage("./images/card.png");
      const { body: portraitBody } = await request(Portrait);
      const portrait = await Canvas.loadImage(await portraitBody.arrayBuffer());
      const portraitBorder = await Canvas.loadImage("./images/portrait.png");

      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      context.drawImage(portrait, 130, 129, 554, 756);
      context.drawImage(portraitBorder, 100, 79, 614, 922);

      context.font = '60px sans-serif';
      context.fillStyle = '#ffffff';
      context.fillText(Name, canvas.width / 2.5, canvas.height / 1.8);

      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "character.png",
      });

      interaction.reply({ files: [attachment], flags: MessageFlags.Ephemeral });
    }
  },
});
