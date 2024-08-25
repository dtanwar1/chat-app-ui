import React, { useEffect, useState,createContext, useContext,useMemo,useRef } from "react";
import { useNavigate } from 'react-router-dom';
import List from "../list/List";
import Chat from "../chat/Chat";


export const UserContext = createContext();



export default function Window() {

  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [selectedFriendInfo, setSelectedFriendInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
      if (!localStorage.getItem("currentUserData")) {
          navigate("/signin");
      }else{
        const userInfo = JSON.parse(localStorage.getItem("currentUserData"));
        console.log("setting userInfo")
        setCurrentUserInfo(userInfo)
      }
  },[]);

  const contextData = {
    currentUserInfo,
    selectedFriendInfo,
    setSelectedFriendInfo,
  }

  return (
    <UserContext.Provider value={contextData}>
      <div className="container">
        <List/>
        <Chat/>
      </div>
  </UserContext.Provider>
  );
}