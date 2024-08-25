import React, { useEffect, useState, useRef,useContext } from "react";
import "./chat.css";
import EmojiPicker from 'emoji-picker-react';
import { generateHSL } from "../../util/avataColor";
import { UserContext } from "../mainWindow/Window"; 
import Avatar from '@mui/material/Avatar';
import { io } from "socket.io-client";
import { format } from "timeago.js";
import { addChat, getChats } from "../../service/chatService";

export default function Chat() {
    const[open, setOpen] = useState(false);
    const[text, setText] = useState("");
    const[textCollections, setTextCollections] = useState([]);
    const[recievedMessage, setRecievedMessage] = useState("");
    const[onlineUsers, setOnlineUsers] = useState(new Set());
    const socket = useRef();

    const {currentUserInfo,
            selectedFriendInfo,
            setSelectedFriendInfo
    } = useContext(UserContext);

    const friendId = selectedFriendInfo ? selectedFriendInfo.friendId: selectedFriendInfo;
    const friendName = selectedFriendInfo ? selectedFriendInfo.friendName: selectedFriendInfo;
    const roomId = selectedFriendInfo ? selectedFriendInfo.roomId: selectedFriendInfo;
    const userId = currentUserInfo ? currentUserInfo.userId: currentUserInfo;
    const endRef = useRef(null);

    useEffect(()=>{
        socket.current = io('http://localhost:5000/');
        socket.current.on("msg-recieve", (data) =>{
            setRecievedMessage(data);
        });
    },[]);

    useEffect(()=>{
        socket.current.emit("add-user", userId);
        socket.current.on("get-users", (users)=>{
            console.log("online");
            console.log(users);
            if(users && typeof users[Symbol.iterator] === 'function'){
                setOnlineUsers(new Set(users));
            }
        });
    },[userId]);

    useEffect(()=>{
        endRef.current?.scrollIntoView({behaviour:'smooth'});
    },[textCollections]);


    useEffect(()=>{
        if(roomId){
            console.log(roomId);
            setTextCollections([]);
            const fetchUserData = async () => {
                const response = await getChats(roomId);
                if(response.isOk){
                    setTextCollections(response.val);
                }else{
                    console.error("Error fetching chat data:", response.error);
                }
            };
            fetchUserData();
        }
    },[selectedFriendInfo]);

    const handleEmoji =(e) =>{
        setText(prev=>prev+e.emoji);
        setOpen(false);
    }

    const handleSendClick = async() =>{
            if(roomId){
                const data = { senderId: userId,
                               roomId:roomId,
                               message: text,
                               createdAt:new Date().toISOString()
                             };
                socket.current.emit("send-msg", {
                    recieverId: friendId,
                    data
                });                
                const response  = await addChat(data);
                if(response.isOk){
                    setTextCollections(prevCollection=> [...prevCollection,response.val]);
                }else{
                    console.error("Error adding chat data:", response.error);
                }
                setText("");
              
            }else{
                console.log("Room id needed");
            }
      

    }

    useEffect(() => {
        recievedMessage && setTextCollections((prev) => [...prev, recievedMessage]);
    }, [recievedMessage]);

  return (
   <div className= {friendName ? "chat" : "chat unSelected"}>
    { friendName &&
    <>
        <div className="top">
            <div className="user">
                <Avatar sx={{height:'50px', width:'50px', backgroundColor:generateHSL(friendName)}} alt={friendName} src={'/static/images/avatar/1.jpg'} />
                <div className="texts">
                    <span>{friendName}</span>
                    <p>{onlineUsers.has(friendId)?'online':'offline'}</p>
                </div>
            </div>
            {/* <div className="icons">
                <img src="./phone.png" alt="" />
                <img src="./video.png" alt="" />
                <img src="./info.png" alt="" />
            </div> */}
        </div>
        <div className="center">
        {textCollections.map((content, index) => (
                <React.Fragment key={index}>
                    <div  className={content.senderId === userId? "message own" : "message"}>
                    {content.senderId !== userId && <Avatar sx={{fontSize:'small',height:'30px', width:'30px', backgroundColor:generateHSL(friendName)}} alt={friendName} src={'/static/images/avatar/1.jpg'} />}
                        <div className="texts">
                            <p>{content.message}</p>
                            <span>{format(content.createdAt)}</span>
                        </div>
                    </div>
                </React.Fragment>
        ))}
            <div ref={endRef}></div>
        </div>
        
        <div className="bottom">
            <input type="text" 
            placeholder="Start a converation ..." 
            value={text}
            onChange={(e) => setText(e.target.value)}/>
            <div className="emoji">
                <img src="./emoji.png" alt="" onClick={()=>setOpen(prev=> !prev)} />
                <div className="picker">
                    <EmojiPicker open = {open} onEmojiClick={handleEmoji}/>
                </div>
            </div>
            <button onClick={handleSendClick} className="sendButton">Send</button>
        </div>
    </>
    }
    {!friendName &&  <h1>Start a converation</h1>}
   </div>
  );
}