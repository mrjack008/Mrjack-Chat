import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { io } from "socket.io-client";
import DropDown from "./DropDown";
import { v4 as uuidv4 } from "uuid";
import { BiDownload } from "react-icons/bi";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, host, downloadattachment } from "../utils/APIRoutes";
import NewGroup from "./NewGroup";
import Linkgroup from "./Linkgroup";
import ExitGroup from "./ExitGroup";
import DeleteGroup from "./DeleteGroup";
import More from "./More";
import ClearChat from "./ClearChat";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const download = async (message) => {
   
      const response=await fetch(`${downloadattachment}/${message.message}`)
      console.log(response);
      const data = await response.arrayBuffer();
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = message.message;
      a.click();
      URL.revokeObjectURL(url);
 
  }
  const id =  JSON.parse(
    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
  );
  useEffect(async () => {
    
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    console.log(currentChat);
    if(currentChat.groupname){
      socket.current.emit("join-group", {
        group:currentChat._id
      });
      console.log("hajgsdhjdsa");
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id+'g',
      });
      setMessages(response.data);
      console.log("messsage:"+messages);
    }
    else{
      const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    console.log(response);
    setMessages(response.data);
    console.log(messages); 
  }
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {

    console.log(msg);
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    console.log(data);
    console.log(currentChat);
    if(currentChat.groupname){
      
      
      console.log("here");
      socket.current.emit("send-group-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
    }else{
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
    }
   
    if(currentChat.groupname){
      console.log("here");
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id+'g',
        name:data.username,
        message: msg,
      });
    }else{
      let databot= await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        name:data.username,
        message: msg, 
      });
      console.log(databot.data);
      if(databot.data.from){
        socket.current.emit("send-msg", {
          to: databot.data.receiver,
          from: databot.data.from,
          msg,
        });
      }
    }
 

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
      socket.current.on("group-msg-received", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username ? currentChat.username : currentChat.groupname}</h3>
          </div>
        </div>
 
        {id._id === currentChat.admin && <DropDown groupname={currentChat.groupname}/>}
        {currentChat.groupname && <Linkgroup token={currentChat.token} groupname={currentChat.groupname}/>}
        {id._id === currentChat.admin && <DeleteGroup groupname={currentChat}/>}
        {currentChat.groupname && <ExitGroup groupname={currentChat.groupname}/>}
        <ClearChat userId ={currentChat}/>
        <Logout />

      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  {message.image==='true'&&(<img style={{maxWidth:'200px'}} src={`http://localhost:5000/images/${message.message}`} alt="image"/>)}
                  {message.video==='true'&&(<video style={{maxWidth:'300px'}} src={`http://localhost:5000/images/${message.message}`} alt="video" type='video/mp4' controls/>)} 
                  <p>{message.message}</p>
                  {message.image === 'true' && (
                    
                    <Button onClick={()=>{download(message)}}>
                     
                      <BiDownload />
                    </Button>
                  )}
                  {message.video === 'true' && (
                    
                    <Button onClick={download}>
                     
                      <BiDownload />
                    </Button>
                  )}
                  {message.other === 'true' && (
                    
                    <Button onClick={download}>
                     
                      <BiDownload />
                    </Button>
                  )}
                </div>
                <div
                className={`hidden ${
                  message.fromSelf ? "show" : "dontshow"
                }`}
              >
                <p style={{color:"green",marginTop:"30px",marginLeft:"10px"}}>{message.name}</p>
                </div>
              </div>
              
            </div>
          );
        })}
        
      </div>
      <ChatInput handleSendMsg={handleSendMsg} to={currentChat} socket={socket}/>
    </Container>
  ); 
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  margin-right:3rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
    .show{
      display:none;
    }
  }
`;
