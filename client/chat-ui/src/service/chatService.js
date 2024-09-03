import axios from 'axios';
import Errors from '../util/error';
const baseURL = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CHAT_ENDPOINT}`; 

const chatAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add Friend
export const addFriend = async (friendData) => {
  try {
    const response = await chatAxios.post('/addfriend', friendData);
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};

// Add Chat
export const addChat = async (chatData) => {
  try {
    const response = await chatAxios.post('/addchat', chatData);
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};

// Get Chats
export const getChats = async (roomId) => {
  try {
    const response = await chatAxios.get(`/chats?roomId=${roomId}`);
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};

// Get All Friends
export const getAllFriends = async (userId) => {
  try {
    const response = await chatAxios.get(`/friends?userId=${userId}`);
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};


