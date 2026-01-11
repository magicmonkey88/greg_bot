const { Sequelize } = require("sequelize");
const fs = require("node:fs");
const path = require("node:path");

const { DB, DB_USERNAME, DB_PASSWORD } = process.env;
const sequelize = new Sequelize(DB, DB_USERNAME, DB_PASSWORD, {
  host: "localhost",
  dialect: "mariadb",
  logging: false,
});

/** @type {import("./types").DbModels & { sequelize: Sequelize, Sequelize: typeof Sequelize }} */
const db = {};
const modelsPath = path.join(__dirname, "models");
const files = fs.readdirSync(modelsPath).filter((file) => file.endsWith(".js"));

for (const file of files) {
  const modelDefiner = require(path.join(modelsPath, file));
  const model = modelDefiner(sequelize);
  db[model.name] = model;
}

for (const model of Object.values(db)) {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
