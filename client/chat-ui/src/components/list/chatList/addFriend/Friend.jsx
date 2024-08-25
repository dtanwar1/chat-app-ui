import React,{useState,useContext} from "react";
import "./Friend.css";
import Avatar from '@mui/material/Avatar';
import { UserContext } from "../../../mainWindow/Window"; 
import { getUserByEmail } from "../../../../service/authService";
import { addFriend } from "../../../../service/chatService";
import { Alert, Snackbar } from '@mui/material';

export default function Friend({addToFriend}) {  

  const {currentUserInfo} = useContext(UserContext);
  const {userId,fullName} = currentUserInfo ? {userId: currentUserInfo.userId, fullName : currentUserInfo.fullName} : currentUserInfo;
  const [friendName, setFriendName] = useState("");
  const [friendId,setFriendId] = useState("");

  const [error, setError] = useState(null);

  const handleClose = () => {
    setError(null);
  };
  const handleSubmit = async(event)=>{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if(validateFormData(data)){
        const emailId = data.get('email');
        const response = await getUserByEmail(emailId);
        if(response.isOk){
          setFriendName(response.val.fullName);
          setFriendId(response.val.userId);
        }else{
          setError("No such user exist");
          console.log("Failed to fetch friend",response.error.code);
        }
      
    }
  }

  const handleAddFriendClick = async() =>{
    
      const data =   {userId:userId,
                      friendId:friendId,
                      friendName:friendName,
                      userName:fullName}       
      const response  = await addFriend(data);
      if(response.isOk){
        addToFriend(response.val);
      }else{
        console.log("Error adding friend");
      }
    
  }

  function validateFormData(data){
    if(data.get('email')){
        return true;
    }
    return false;
  }


  return (
   <div className="friend">
    <form onSubmit={handleSubmit}>
        <input type = "text" placeholder="email" name="email" ></input>
        <button>Search</button>
    </form>
    {friendName && <div className="user">
        <div className="detail">
            <Avatar sx={{height:'50px', width:'50px'}} alt={friendName} src={'/static/images/avatar/1.jpg'} />
            <span>{friendName}</span>
        </div>
        <button onClick={handleAddFriendClick}>Add Friend</button>
    </div>}
    <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
    </Snackbar>
   </div>

   
  );
}

