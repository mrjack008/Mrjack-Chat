const bcrypt = require("bcrypt");
const { UsersChat, GroupChat } = require("../models psql/index");
const { Op } = require("sequelize");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');


module.exports.getAllGroups = async (req, res, next) => {
    try {
      // const users = await User.find({ _id: { $ne: req.params.id } }).select([
      //   "email",
      //   "username",
      //   "avatarImage",
      //   "_id",
      // ]);
      const id = req.params.id;
      console.log("id:" + id);
  
      fs.readFile("./messages/allgroup.json", "utf8", async (err, data) => {
        if (err) throw err;
  
        // parse the JSON data
        const jsonData = JSON.parse(data);
  
        // filter out the groups that the user is in
        const groups = jsonData
          .filter((group) => group.users.includes(id))
          .map((group) => group.name);
  
  
        const users = await GroupChat.findAll({
          where: {
            groupname: { [Op.in]: groups },
          },
          attributes: ["groupname", "avatarImage", "_id","admin","token"],
        }).catch((err) => {
          console.log(err);
        });
  
        return res.json(users);
      });
    } catch (ex) {
      next(ex);
    }
  };
  
  module.exports.getOneGroup = async (req, res, next) => {
    try {
      console.log(req.body);
      const {groupname,token} = req.body;
  
      const group = await GroupChat.findAll({
        where: {
          groupname: groupname,
          token:token,
        },
      })
      console.log(group);
      if(group){
        return res.json({group:group[0].toJSON()});
  
      }
      else{
        return;
      }
    } catch (ex) {
      next(ex);
    }
  };

  
module.exports.addgroup = async (req, res, next) => {
    console.log(req.body);
    const { groupname, about, image,id } = req.body;
    let groupid;
    try {
      // Create the data object that you want to add to the file
      const newData = {
        groupname: groupname,
        about: about,
      };
      const token = uuidv4();
      const groupaa = await GroupChat.create({
        groupname,
        about,
        admin:id,
        isAvatarImageSet: true,
        avatarImage: image,
        token:token
    }).then((done) => {
        console.log(done._id);
        groupid=done._id+'g'
        })
        .catch((err) => {
        console.log(err);
        });
      fs.readFile("./messages/allgroup.json", "utf8", (err, data) => {
        if (err) throw err;
  
        // parse the JSON data
        let jsonData = JSON.parse(data);
  
        // check if the group already exists in the JSON file
        let group = jsonData.find((g) => g.name === groupname);
        if (group) {
          console.log("heheheh");
          return res.json({ status: false, groupname });
        } else {
          // create a new group with the user
  
          jsonData.push({ name: groupname,id:groupid, about: about, users: [] });
        }
      

        // write the updated data back to the file
        data = fs.writeFile(
          "./messages/allgroup.json",
          JSON.stringify(jsonData),
          "utf8",
          (err) => {
            if (err) throw err;
            return res.json({ status: true, groupname });
          }
        );
  
        console.log(data);
      });
      // if (!fs.existsSync(`./messages/${groupname}.json`)) {
      //   fs.writeFileSync(`./messages/${groupname}.json`, JSON.stringify([{users:"27616871236"}]));
      // }
      // let jsonData = fs.readFileSync(`./messages/${groupname}.json`);
      //   jsonData = JSON.parse(jsonData);
      //   jsonData.push(newData);
      //   jsonData = JSON.stringify(jsonData);
      //   // Append the JSON string to the file
      //   data=fs.writeFileSync(`./messages/${groupname}.json`, jsonData);
      
    } catch (ex) {
      next(ex);
    }
  };
  
  module.exports.addmember = async (req, res, next) => {
    console.log(req.body);
    const { users } = req.body;
    const { groupname } = req.body.groupname;
    console.log(users);
    
    try {
      // Create the data object that you want to add to the file
      const newData = {
        groupname: groupname.groupname,
        users: users,
      };
      fs.readFile("./messages/allgroup.json", "utf8", (err, data) => {
        if (err) throw err;
  
        // parse the JSON data
        let jsonData = JSON.parse(data);
  
        // check if the group already exists in the JSON file
        let group = jsonData.find((g) => g.name === groupname);
        if (group) {
          // check if the user is already present in the group
          users.forEach((user) => {
            if (group.users.includes(user)) {
              console.log(`User ${user} already present in group ${groupname}`);
              added = false;
            }
            // add the user to the existing group
            else {
              group.users.push(user);
              added = true;
              console.log("donedsfdsf");
            }
          });
        } else {
          // create a new group with the user
          jsonData.push({ name: groupname, users: [users] });
          console.log("here");
          added = true;
        }
  
        // write the updated data back to the file
        data = fs.writeFile(
          "./messages/allgroup.json",
          JSON.stringify(jsonData),
          "utf8",
          (err) => {
            if (err) throw err;
          }
        );
        if (added) return res.json({ status: true });
        else return res.json({ status: false });
      });
    } catch (ex) {
      next(ex);
    }
  };
  module.exports.invitegroup = async (req, res, next) => {
  
    try {
      console.log(req.body);
      const { id,groupname,token } = req.body;
      const group = await GroupChat.findAll({
        where: {
          groupname: groupname,
          token:token,
        },
      })
      console.log(group);
      if(group){
              // Create the data object that you want to add to the file
  
            fs.readFile("./messages/allgroup.json", "utf8", (err, data) => {
              if (err) throw err;
  
              // parse the JSON data
              let jsonData = JSON.parse(data);
  
              // check if the group already exists in the JSON file
              let group = jsonData.find((g) => g.name === groupname);
              if (group) {
                // check if the user is already present in the group
                  if (group.users.includes(id)) {
                    console.log(`User ${id} already present in group ${groupname}`);
                    added = false;
                    return res.json({ status: false });
                  }
                  // add the user to the existing group
                  else {
                    group.users.push(id);
                    added = true;
                    console.log("donedsfdsf");
                  }
                  // write the updated data back to the file
              data = fs.writeFile(
                "./messages/allgroup.json",
                JSON.stringify(jsonData),
                "utf8",
                (err) => {
                  if (err) throw err;
                }
              );
              if (added) return res.json({ status: true });
              else return res.json({ status: false });
              }
              else{
                return;
              }
              
            });
      }
      else{
        return res.json({ status: false });
      }
    } catch (ex) {
      next(ex);
    }
  }
  
  
  module.exports.exitgroup = async (req, res, next) => {
    const {id,groupname}=req.body;
    console.log(req.body.groupname);
        // Read the JSON file
      const jsonFile = fs.readFileSync("./messages/allgroup.json");
  
      // Parse the JSON into a JavaScript object
      let groups = JSON.parse(jsonFile);
  
      
      // Find the group with the specified name
      const group = groups.find(g => g.name === groupname);
  
      if(group){
        console.log("jere");
             // Remove the user from the group's users array
             group.users = group.users.filter(userId => userId !== id);
  
            // Convert the updated JavaScript object back into a JSON string
            const updatedJson = JSON.stringify(groups);
  
            // Overwrite the original file
            fs.writeFileSync("./messages/allgroup.json", updatedJson);
            return res.json({ status: true });
      }
      else{
        return res.json({status:false})
      }
      
  }
  
  
  module.exports.deletegroup = async (req, res, next) => {
    const{id,groupname}=req.body;
    console.log(req.body);
    // Read the JSON file
    const jsonFile = fs.readFileSync("./messages/allgroup.json");
  
    // Parse the JSON into a JavaScript object
    let groups = JSON.parse(jsonFile);
  
    console.log(groups);
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].name === groupname) {
            groups.splice(i, 1);
            break;
        }
    }
  
    fs.writeFileSync('./messages/allgroup.json', JSON.stringify(groups));
  
    const deleteg = await GroupChat.destroy({
      where:{
        groupname:groupname,
        _id:id
      }
    })
    if(deleteg===1){
      return res.json({ status: true });
    }
    else{return;}
  }