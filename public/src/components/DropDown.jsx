import React,{useEffect, useState} from 'react'
import {Multiselect} from 'multiselect-react-dropdown'
import axios from "axios";
import { addmember, allUsersRoute } from "../utils/APIRoutes";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure()

function DropDown(groupname) {

    const [contacts, setContacts] = useState([]);
    const [users, setUsers] = useState([]);
    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    }
    async function  addmembers(){
      const { data } = await axios.post(addmember, {
        groupname,
        users,
      });
      console.log(data.status);
      if (data.status == true) {
       
        toast.success('New Member Added', toastOptions);
      }
      else{
        toast.error('Member Already Exist', toastOptions);
      }

    }
    useEffect(async () => {
        const id = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )._id;
        
            const data = await axios.get(`${allUsersRoute}/${id}`);

            setContacts(data.data);
         
 
      }, []); 
    if(groupname.groupname==undefined){
      return null;
    }
    else{
      return (
  
        <div style={{width:"90%",justifyContent:"center",display:"flex"}}>
          <div className='DropDown' style={{display:"flex"}}>
                <h3 style={{color:"greenyellow",marginRight:"1rem"}}>Add Users</h3>
                <Multiselect options={contacts}  displayValue='username' onSelect={async(e)=>{
                   const usernames= e.map(option => option._id);
                     setUsers(usernames);
                }} onRemove={(e)=>{}} />
                <Button onClick={async()=>{addmembers()}}>Add</Button>
          </div>
        </div>
        
      )
      


    }

   
    
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

export default DropDown
