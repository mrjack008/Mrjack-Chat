
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const apiKey = "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";
const { Configuration, OpenAIApi } = require("openai");
const {  MessageChat } = require("../models psql/index");
const multer =require("multer")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './attachment')
  },
  filename: function (req, file, cb) {
    cb(null,`${Date.now()}_${file.originalname}`)
  },
  

})

const upload = multer({ storage: storage }).single("file")
const crypto = require('crypto');
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
const axios = require('axios');
// Specify the encryption algorithm and key
const algorithm = 'aes-256-cbc';
const key = Buffer.from("aa3511a5e9774fbf4fddf96c91e6684cf7efa78bec13a6aa4964ba80671d8b7a", 'hex');
const iv = Buffer.from("0dd868237703cff0c24452bb3bed2bb9", 'hex');

// Encrypt the message
function encrypt(message) {
  console.log("key:"+key.toString('hex'));
  console.log("iv:"+iv.toString('hex'));
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}


// Decrypt the message
function decrypt(message) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(message, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}



module.exports.getMessages = async (req, res, next) => {
  try {
    var { from, to } = req.body;
    console.log(from,to);
    let messageFile = `./messages/users/${from}.json`;
    let jsonString = fs.readFileSync(messageFile);
    let jsonData = JSON.parse(jsonString);
    console.log(to.length);
    // find the messages where the users array contains both 'from' and 'to'
    if(to.length>36){
      console.log("group");
      var messages = jsonData.filter(message => message.users.includes(to));
      console.log(messages);
    }
    else{
      var messages = jsonData.filter(message => message.users.includes(from) && message.users.includes(to));
    }
    // sort the messages by the updatedAt property
    messages.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const projectedMessages = messages.map(msg => {
 
        console.log("msgshdshaj");
        return MessageChat.findAll({
          where: {
            _id: msg.message
          },
          attributes: ["message"],
        }).then(messages => {
          console.log(msg.image);
          return {
            fromSelf: msg.sender.toString() === from,
            message: decrypt(messages[0].dataValues.message),
            name: msg.name,
            image:msg.image,
            video:msg.video,
            other:msg.other
          }
        }).catch(err => {
          console.log(err);
        });
    })
       
    Promise.all(projectedMessages).then(result => {
      res.json(result);
  });
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    var { from, to, message,name } = req.body;
    if(to=='65655ee2-65d9-4da2-a8a1-065927b76f24'){
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature:0,
        max_tokens:1000,
        top_p:1,
        frequency_penalty:0.0,
        presence_penalty:0.0
      });
                   
      console.log(completion.data.choices[0].text);
      const encryptedMessages = encrypt(message);
      const messagechat1 = await MessageChat.create({
            message:encryptedMessages.encryptedData
      }).then((data)=>{
        id = data._id;
        console.log("id"+id);
      }).catch((err)=>{console.log(err);})
      const newData1 = {
        message: id,
        users: [from, to],
        sender: from,
        name:name
      };
      sentFile = `./messages/users/${from}.json`;
      let jsonData1 = fs.readFileSync(sentFile);
        jsonData1 = JSON.parse(jsonData1);
        jsonData1.push(newData1);
        jsonData1 = JSON.stringify(jsonData1);
        // Append the JSON string to the file
        data1=fs.writeFileSync(sentFile, jsonData1);
        const encryptedMessage = encrypt(completion.data.choices[0].text);
      const messagechat = await MessageChat.create({
            message:encryptedMessage.encryptedData
      }).then((data)=>{
        id = data._id;
        console.log("id"+id);
      }).catch((err)=>{console.log(err);})
      const newData = {
        message: id,
        users: [to, from],
        sender: to,
        name:'jack'
      };
      let jsonData = fs.readFileSync(sentFile);
      jsonData = JSON.parse(jsonData);
      jsonData.push(newData);
      jsonData = JSON.stringify(jsonData);
      // Append the JSON string to the file
      data=fs.writeFileSync(sentFile, jsonData);
      
      
      if (data) return res.json({ msg: "Failed to add message to the database." });
      else return res.json({ msg: "Message added successfully.",message:completion.data.choices[0].text,sender:to,receiver:from });
    }

   // Create the data object that you want to add to the file
   const encryptedMessage = encrypt(message);
   console.log("hdhg");
   console.log(encryptedMessage);
   const messagechat = await MessageChat.create({
        message:encryptedMessage.encryptedData
   }).then((data)=>{
     id = data._id;
    console.log("id"+id);
   }).catch((err)=>{console.log(err);})



  if(to.length>36){
    receivedFile = `./messages/groups/${to}.json`;
    console.log("to:"+to);
    const groupusers = `./messages/allgroup.json`;
      // Read the JSON file
      const jsonString = fs.readFileSync(groupusers);
      const groupmembers = JSON.parse(jsonString);
  
      // Filter the messages
      const filteredMessages = groupmembers.filter(groupmembers => groupmembers.id ===to );
      console.log(filteredMessages[0].users);
      const newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name
        };
        
        if (!fs.existsSync(receivedFile)){
          fs.writeFileSync(receivedFile, "[]");
        }
        let jsonData = fs.readFileSync(receivedFile);
        jsonData = JSON.parse(jsonData);
        jsonData.push(newData);
        jsonData = JSON.stringify(jsonData);
        // Append the JSON string to the file
        data=fs.writeFileSync(receivedFile, jsonData);
        filteredMessages[0].users.forEach(userId => {
          const sentFile = `./messages/users/${userId}.json`;
          if (!fs.existsSync(sentFile)){
            fs.writeFileSync(sentFile, "[]");
          }
          jsonData = fs.readFileSync(sentFile);
          jsonData = JSON.parse(jsonData);
          jsonData.push(newData);
          jsonData = JSON.stringify(jsonData);
          data=fs.writeFileSync(sentFile, jsonData);
        });
        
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
  }
  else{
      sentFile = `./messages/users/${from}.json`;
      receivedFile = `./messages/users/${to}.json`;
      const newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name
        };
        
    
      
    
        if (!fs.existsSync(sentFile)){
          fs.writeFileSync(sentFile, "[]");
        }
        if (!fs.existsSync(receivedFile)){
          fs.writeFileSync(receivedFile, "[]");
        }
        
        let jsonData = fs.readFileSync(sentFile);
        jsonData = JSON.parse(jsonData);
        jsonData.push(newData);
        jsonData = JSON.stringify(jsonData);
        // Append the JSON string to the file
        data=fs.writeFileSync(sentFile, jsonData);
        jsonData = fs.readFileSync(receivedFile);
        jsonData = JSON.parse(jsonData);
        jsonData.push(newData);
        jsonData = JSON.stringify(jsonData);
        data=fs.writeFileSync(receivedFile, jsonData);
        
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
  }



  } catch (ex) {
    next(ex);
  }
};


module.exports.attachment = async (req, res, next) => {

   upload(req,res,async err=>{
    const datas = JSON.parse(req.body.data);
    console.log(datas);
    // Create the data object that you want to add to the file
  var { from, to,name } = datas;
  const encryptedMessage = encrypt(res.req.file.filename);
  console.log("hdhg");
  console.log(encryptedMessage);
  const messagechat =await  MessageChat.create({
       message:encryptedMessage.encryptedData
  }).then((data)=>{
    id = data._id;
   console.log("id"+id);
  }).catch((err)=>{console.log(err);})


  //Add message to JSON file
 if(to.length>36){
   receivedFile = `./messages/groups/${to}.json`;
   console.log("to:"+to);
   const groupusers = `./messages/allgroup.json`;
     // Read the JSON file
     const jsonString = fs.readFileSync(groupusers);
     const groupmembers = JSON.parse(jsonString);
 
     // Filter the messages
     const filteredMessages = groupmembers.filter(groupmembers => groupmembers.id ===to );
     console.log(filteredMessages[0].users);
     const type = path.extname(`./attachment/${res.req.file.filename}`).substr(1);
     console.log(type);
     if(type==='mkv'){
      console.log("heressss");
      newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name,
        video:'true'
        };
     }
     else if(type==='jpg'||type==='png'||type==='jpeg'){
      console.log("here");
      newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name,
        image:'true'
        };
     }
     else{
      console.log("hereeeeee");
      newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name,
        other:'true'
        };
     }
       
       if (!fs.existsSync(receivedFile)){
         fs.writeFileSync(receivedFile, "[]");
       }
       let jsonData = fs.readFileSync(receivedFile);
       jsonData = JSON.parse(jsonData);
       jsonData.push(newData);
       jsonData = JSON.stringify(jsonData);
       // Append the JSON string to the file
       data=fs.writeFileSync(receivedFile, jsonData);
       filteredMessages[0].users.forEach(userId => {
         const sentFile = `./messages/users/${userId}.json`;
         if (!fs.existsSync(sentFile)){
           fs.writeFileSync(sentFile, "[]");
         }
         jsonData = fs.readFileSync(sentFile);
         jsonData = JSON.parse(jsonData);
         jsonData.push(newData);
         jsonData = JSON.stringify(jsonData);
         data=fs.writeFileSync(sentFile, jsonData);
       });
       
 }
 else{
  var newData
     sentFile = `./messages/users/${from}.json`;
     receivedFile = `./messages/users/${to}.json`;
     const type = path.extname(`./attachment/${res.req.file.filename}`).substr(1);
     console.log(type);
     if(type==='mkv'){
      console.log("heressss");
      newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name,
        video:'true'
        };
     }
     else if(type==='jpg'||type==='png'||type==='jpeg'){
      console.log("here");
      newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name,
        image:'true'
        };
     }
     else{
      console.log("hereeeeee");
      newData = {
        message: id,
        users: [from, to],
        sender: from,
        name:name,
        other:'true'
        };
     }
       console.log(newData);
   
     
   
       if (!fs.existsSync(sentFile)){
         fs.writeFileSync(sentFile, "[]");
       }
       if (!fs.existsSync(receivedFile)){
         fs.writeFileSync(receivedFile, "[]");
       }
       
       let jsonData = fs.readFileSync(sentFile);
       jsonData = JSON.parse(jsonData);
       jsonData.push(newData);
       jsonData = JSON.stringify(jsonData);
       // Append the JSON string to the file
       data=fs.writeFileSync(sentFile, jsonData);
       jsonData = fs.readFileSync(receivedFile);
       jsonData = JSON.parse(jsonData);
       jsonData.push(newData);
       jsonData = JSON.stringify(jsonData);
       data=fs.writeFileSync(receivedFile, jsonData);
       
 }

    if(err){
      console.log(err);
      return res.json({status:false})
    }
    console.log(res.req.file);
    return res.json({status:true,url:res.req.file.path})
  })
  
} 


module.exports.attachmentone = async (req, res, next) => {
  console.log("here");
  console.log(req.params.path);
  return res.download('./attachment/'+req.params.path)
}