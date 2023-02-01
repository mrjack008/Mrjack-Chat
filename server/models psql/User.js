const { Model,Op } = require("sequelize");
const { isRegExp } = require("lodash");

module.exports = (sequelize, DataTypes) => {

    class UsersChat extends Model {
        toJSON() {
            return { ...this.get() };
        }
    }
    UsersChat.init(
        {
            _id: {
                type: DataTypes.STRING,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            username:{
                type: DataTypes.STRING,
                is: ['[a-z]','i'],
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                },
                unique: true
            },
            isAvatarImageSet: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    // length: {
                    //     min: 6,
                    //     max: 50
                    // } 
                    // check if password constains atleast one number, one special character and one uppercase and lowercase letter
                    // must: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/
                },
                isRegExp : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/,

            },
            avatarImage: {
            type: DataTypes.TEXT,
            defaultValue:""
            },
        },
        {
            sequelize, timestamps: true,
            tableName : "UsersChat",
        }
    );
     return UsersChat;
}