
const bcrypt = require("bcrypt");
const { UsersChat, GroupChat } = require("../models psql/index");
const { Op } = require("sequelize");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');


module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UsersChat.findOne({
      where: {
        username,
      },
    });
    if (!user) return res.json({ msg: "Username is Invalid", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await UsersChat.findOne({
      where: {
        username,
      },
    });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await UsersChat.findOne({
      where: {
        email,
      },
    });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UsersChat.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};



module.exports.getAllUsers = async (req, res, next) => {
  try {
    // const users = await User.find({ _id: { $ne: req.params.id } }).select([
    //   "email",
    //   "username",
    //   "avatarImage",
    //   "_id",
    // ]);
    const users = await UsersChat.findAll({
      where: {
        _id: {
          [Op.ne]: req.params.id,
        },
      },
      attributes: ["email", "username", "avatarImage", "_id"],
    }).catch((err) => {
      console.log(err);
    });

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};



module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await UsersChat.update(
      {
        isAvatarImageSet: true,
        avatarImage: avatarImage,
      },
      {
        where: { _id: userId },
        returning: true,
      }
    ).catch((err) => {
      console.log(err);
    });
    return res.json({
      isSet: userData[1][0].toJSON().isAvatarImageSet,
      image: userData[1][0].toJSON().avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};


module.exports.clearchat = async (req, res, next) => {
    
    const {senderId,userId}=req.body
    console.log(req.body);
 
      const messageFile = `./messages/users/${senderId}.json`;
      // Read the JSON file
      const jsonString = fs.readFileSync(messageFile);
      const messages = JSON.parse(jsonString);
  
      // Filter the messages
      const filteredMessages = messages.filter(message => message.sender !== userId && message.users[1] !== userId);
      console.log(filteredMessages);
      // Convert the filtered object back into a JSON string
      const newJsonString = JSON.stringify(filteredMessages);
  
      // Overwrite the original JSON file with the new JSON string
      fs.writeFileSync(messageFile, newJsonString);
      return res.json({ status: true });
    
    
  }