import React,{useState, useEffect, useContext} from "react";
import "./userInfo.css";
import Avatar from '@mui/material/Avatar';
import { UserContext } from "../../mainWindow/Window"; 
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { generateHSL } from "../../../util/avataColor";

export default function UserInfo() {
    const {currentUserInfo} = useContext(UserContext);
    const fullName = currentUserInfo ? currentUserInfo.fullName:currentUserInfo;
    const navigate = useNavigate();

    const handleLogOutClick = ()=>{
        if (localStorage.getItem("currentUserData")) {
            localStorage.removeItem("currentUserData");
        }
        navigate("/signin");
    }

    return (
        <div className="userInfo">
        <div className="user">
            <Avatar sx={{height:'50px', width:'50px', backgroundColor:generateHSL(fullName)}} alt={fullName} src={'/static/images/avatar/1.jpg'} />
            <h2>{fullName}</h2>
        </div>
        <div style={{gap:'20px',display:'felx'}} alt=""></div>
            <LogoutIcon sx={{width: '20px', height: '20px', cursor: 'pointer'}} onClick={handleLogOutClick}></LogoutIcon>
        </div>
    );
}



