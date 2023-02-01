import React,{useEffect, useState} from 'react'
import {Multiselect} from 'multiselect-react-dropdown'
import axios from "axios";
import { addmember, allUsersRoute } from "../utils/APIRoutes";
import { BiExit } from "react-icons/bi";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure()

function More(groupname) {


    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    }


      return (
        <div>
        <Container>
        <div className='flex flex-col dropDownMenu'>
            <ul className='flex flex-col gap-5 listMenu' style={{'list-style-type':'none'}}>
                <li>Profile</li>
                <li>Exit</li>
                <li>Clear</li>
            </ul>
        </div>
        </Container>
        </div>
        
      )
      


    

   
    
}



const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  margin-left:1rem;
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
.dropDownMenu{
    position:absolute;
    top:7rem;
    right:8rem;
    background-color:#fff;
    border-radius:8px;
    padding:15px;
    width:80px;
    border:1px solid gray;
}

.listMenu{
    list-style-type:none;
    
}
`

export default More
