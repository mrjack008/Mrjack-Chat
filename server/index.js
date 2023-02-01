const connectToPostgres = async () => await sequelize.authenticate();
const express = require("express");
const path= require("path")
const cors = require("cors");
const authRoutes = require("./routes/auth");
const { sequelize, user, admin } = require("./models psql/index");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());


connectToPostgres()
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.error("Could not connect to the database. Exiting now...", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/images/:id", (request, response, next) => {
  if (request.params.id) {
    // the request.filename property is accessible here
    console.log(request.params.id)
    // create the file path by joining the static directory and the filename 
    const filePath = path.join(__dirname,'attachment',request.params.id);
    
    // serve the static file
    response.sendFile(filePath, (error) => {
      if (error) {
        response.status(400).send({ error: "File not found" });
      }
    });
  } else {
    // return an error if the request.filename property is not accessible
    response.status(400).send({ error: "Filename not found" });
  }
});




const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
// Keep track of connected users and their groups

global.onlineUsers = new Map();
global.groups = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  onlineUsers.set("65655ee2-65d9-4da2-a8a1-065927b76f24","jackbot")
  
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });


  socket.on("join-group", (groupId) => {

    if (!groups.has(groupId.group)) {
      groups.set(groupId.group, new Set());
  }
  groups.get(groupId.group).add(socket.id);
   
    console.log(groups);
    console.log(onlineUsers);
  });

  socket.on("send-group-msg", (data) => {
    console.log(data);
  
    if (!groups.has(data.to)) {
      console.log("dsa");
      console.log(data.to);
        return;
    }
    const group = groups.get(data.to);
    console.log(group);
    group.forEach((id) => {
        console.log(id);
        console.log("dshj");
        socket.to(id).emit("msg-recieve", data.msg);
    });
  });


  socket.on("send-msg", (data) => {
    
    console.log("sendmessage",{data});
    console.log(onlineUsers);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket!='jackbot') {
      console.log(sendUserSocket);
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
    if(sendUserSocket=='jackbot'){
      console.log("here");
      const sendUserSockets = onlineUsers.get(data.from);
      console.log(sendUserSockets);
      console.log(data.msg);
      socket.to(sendUserSockets).emit("msg-recieve", data.msg);
    }
  });
});
