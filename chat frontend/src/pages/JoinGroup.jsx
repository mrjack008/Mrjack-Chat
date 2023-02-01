import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { useNavigate, Link, Navigate, useParams } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  getOneGroup, joinGroup } from '../utils/APIRoutes';
import axios from 'axios';


function JoinGroup() {
    const [data,Setdata]=useState([])
    const { groupname, token } = useParams();
    const navigate = useNavigate();
    useEffect(async () => {
            const { data } = await axios.post(getOneGroup, {
                groupname,
                token,
              });
            console.log(data);
            Setdata(data.group)
      }, []);
    const handleClick = async () => {
        const id = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )._id;
        const data = await axios.post(joinGroup, {
            id,
            groupname,
            token,
        });
        console.log(data);
        if (data.data.status ==true) {
            toast.success("Joined")
            navigate("/");
        }
        else{
            toast.error("Already Member")
        }
        };


  return (
    <>
    <FormContainer>
     
        <div className="brand">
                <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${data.avatarImage}`}
                      alt=""
                    />
                </div>
          <h1>{groupname}</h1>
          <button onClick={handleClick}>Join Group</button>
        </div>
        
    </FormContainer>
    <ToastContainer />
  </>
  )
}


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
      margin-bottom:2rem;
      margin-left:5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    margin-top:3rem;
    margin-left:2.5rem;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default JoinGroup
