const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Guild",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      musicChannel: DataTypes.STRING,
      musicChannelMessage: DataTypes.STRING,
      joinedAt: DataTypes.DATE,
    },
    {
      timestamps: false,
    }
  );
};
