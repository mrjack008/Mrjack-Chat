import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineFile } from "react-icons/ai";
import styled from "styled-components";
import axios from "axios";
import { clearChat, exitGroup } from "../utils/APIRoutes";
export default function ClearChat(userId ) {
  const navigate = useNavigate();
  var data
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    console.log(userId);
    if(userId.userId.groupname){
       data= await axios.post(clearChat, {
        senderId: id,
        userId :userId.userId._id+'g',
      });
    }else{
      data= await axios.post(clearChat, {
        senderId: id,
        userId :userId.userId._id,
      });
    }
    
      console.log(data);
    if (data.data.status === true) {
      window.location.reload();
    }
    else{
       alert("failed");
    }
  };
  return (
    <Button onClick={handleClick}>
      <AiOutlineFile />
    </Button>
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
