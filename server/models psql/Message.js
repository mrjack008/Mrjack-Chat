const { Model,Op } = require("sequelize");
const { isRegExp } = require("lodash");

module.exports = (sequelize, DataTypes) => {

    class MessageChat extends Model {
        toJSON() {
            return { ...this.get() };
        }
    }
    MessageChat.init(
        {
            _id: {
                type: DataTypes.STRING,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            message: {
                type: DataTypes.TEXT,
                defaultValue:""
            }
        },
        {
            sequelize, timestamps: true,
            tableName : "MessageChat",
        }
    );
     return MessageChat;
}