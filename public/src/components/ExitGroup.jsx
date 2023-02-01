import React from "react";
import { useNavigate } from "react-router-dom";
import { BiExit } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { exitGroup } from "../utils/APIRoutes";
export default function ExitGroup(groupname) {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data= await axios.post(exitGroup, {
        id: id,
        groupname:groupname.groupname,
      });
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
      <BiExit />
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
