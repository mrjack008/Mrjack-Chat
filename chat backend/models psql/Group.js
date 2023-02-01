const { Model,Op } = require("sequelize");
const { isRegExp } = require("lodash");

module.exports = (sequelize, DataTypes) => {

    class GroupChat extends Model {
        toJSON() {
            return { ...this.get() };
        }
    }
    GroupChat.init(
        {
            _id: {
                type: DataTypes.STRING,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            groupname:{
                type: DataTypes.STRING,
                is: ['[a-z]','i'],
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
                unique: true,
            },
            isAvatarImageSet: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            about: {
                type: DataTypes.TEXT,
                defaultValue:""
            },
            admin: {
                type: DataTypes.STRING,
                defaultValue:""
            },
            token: {
                type: DataTypes.TEXT,
                defaultValue:""
            },
            avatarImage: {
            type: DataTypes.TEXT,
            defaultValue:""
            },
        },
        {
            sequelize, timestamps: true,
            tableName : "GroupChat",
        }
    );
     return GroupChat;
}