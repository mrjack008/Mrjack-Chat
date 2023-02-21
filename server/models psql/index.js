const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
   // database name
  // username
   // password
  {
    host:  // cloud : "43.204.216.144" host : "43.204.74.194" to be used when the postgres database online is ready
    dialect: "postgres",
    logging: false,
    port: process.env.PORT,
  }
);
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.log(err));

const db = {
    UsersChat: require("./User")(sequelize, Sequelize),
    GroupChat:require("./Group")(sequelize, Sequelize),
    MessageChat:require("./Message")(sequelize, Sequelize),
  sequelize,
};



module.exports = db;
