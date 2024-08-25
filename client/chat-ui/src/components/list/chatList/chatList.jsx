import React,{useEffect, useState, useContext} from "react";
import "./chatList.css";
import Avatar from '@mui/material/Avatar';
import { UserContext } from "../../mainWindow/Window"; 
import Friend from "./addFriend/Friend";
import { generateHSL } from "../../../util/avataColor";
import { getAllFriends } from "../../../service/chatService";

export default function ChatList() {
  
  const {currentUserInfo,
          selectedFriendInfo,
          setSelectedFriendInfo, 
          onlineUsers,
          setOnlineUsers
        } = useContext(UserContext);

  const userId = currentUserInfo ? currentUserInfo.userId: currentUserInfo;

  const [friendList, setFriendList] = useState([]);
  const [openAddFriend,setOpenAddFriend] = useState(false);
  const [selectedFriendId,setSelectedFriendId] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const handleAddFriend = ()=>{
    setOpenAddFriend(x=> !x);
  }

  const addToFriendList= (newItem)=>{
    const b = {...newItem,hsl: generateHSL(newItem.friendName)}
    setFriendList(prevList => [...prevList, b]);
    setFilteredList(prevList => [...prevList, b]);
  }

  const handleFriendSelection = (item)=>{
    console.log(item);
    setSelectedFriendId(item.friendId);
    setSelectedFriendInfo(item);
  }


  useEffect(()=>{
    if(userId){
      console.log(userId);
      const fetchUserData = async () => {
          const response = await getAllFriends(userId);
          if(response.isOk){
              const modifiedData = response.val.map((item, index) => ({
                ...item,
                hsl: generateHSL(item.friendName)
            }));
            console.log(response.val);
            setFriendList(modifiedData);
            setFilteredList(modifiedData);
          }else{
            console.error("Error fetching data:", response.error);
          }
      };
      fetchUserData();
    }
  },[userId]);


  const handleChange = (e)=>{
    console.log(e.target.value);
    const friends = friendList.filter(x=>x.friendName.toLowerCase().startsWith(e.target.value.toLowerCase()));
    setFilteredList(friends);
  }


  return (
    <>
        <div className="search">
          <div className="searchBar">
            <img src = "./search.png" alt=""/>
            <input type="text" placeholder="Search" onChange={(e)=> handleChange(e)}/>
          </div>
          <img src = {openAddFriend ? "./minus.png":"./plus.png"} alt="" className="add" onClick={handleAddFriend}/>
        </div>
      <div className="chatList">
        <>
        {filteredList.map((item, index) => (
            <div key={index} className={selectedFriendId === item.friendId?"item selected":"item"} onClick={()=>handleFriendSelection(item)}>
              <Avatar sx={{ backgroundColor: `${item.hsl}` ,height: '50px', width: '50px' }} alt={item.friendName} src={`/static/images/avatar/${index + 1}.jpg`} />
              <div className="text">
                <span>{item.friendName}</span>
                <p>{item.message}</p>
              </div>
            </div>
          ))}
        </>
        {openAddFriend && <Friend addToFriend={addToFriendList}/>}
          
      </div>
    </>
    
   
  
  );
}


