import axios from 'axios';
import Errors from '../util/error';
const baseURL = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_AUTH_ENDPOINT}`; 
const authAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Sign Up User
export const signUpUser = async (userData) => {
  try {
    const response = await authAxios.post('/signup', userData);
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await authAxios.post('/login', userData);
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};

// Get All Users
export const getAllUsers = async () => {
  try {
    const response = await authAxios.get('/allUser');
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};

// Get User by Email ID
export const getUserByEmail = async (emailId) => {
  try {
    const response = await authAxios.get(`/user/${emailId}`);
    return Errors.okResult(response.data.val);
  } catch (error) {
    return Errors.errResult(error.message,'Error');
  }
};
