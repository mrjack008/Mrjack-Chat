import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiCopy } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
export default function Linkgroup(token) {
  const navigate = useNavigate();
  const handleClick = async () => {
    console.log(token);
    navigator.clipboard.writeText(`http:localhost:3000/joingroup/${token.groupname}/${token.token}`);
  };
  return (
    <Button onClick={handleClick}>
      <BiCopy />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right:3rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
