import React from "react";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import styled from "styled-components";
import axios from "axios";
import { deleteGroup } from "../utils/APIRoutes";
export default function DeleteGroup(groupname) {
  const navigate = useNavigate();
  const handleClick = async () => {
    console.log(groupname.groupname);
    const data= await axios.post(deleteGroup, {
        id: groupname.groupname._id,
        groupname:groupname.groupname.groupname,
      });
    console.log("data:"+data);
    if (data.data.status === true) {
      window.location.reload();
    }
    else{
       alert("failed");
    }
  };
  return (
    <Button onClick={handleClick}>
      <AiFillDelete />
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
