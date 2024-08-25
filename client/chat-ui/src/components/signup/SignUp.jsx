import React, { useEffect, useState }  from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Snackbar } from '@mui/material';
import { signUpUser } from '../../service/authService';
import { useNavigate } from 'react-router-dom';



const defaultTheme = createTheme();
export default function SignUp() {

  const navigate = useNavigate();

  const [values, setValues] = useState({ firstName: "", lastName: "", email: "",password: "",confirmPassword:"" });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleClose = () => {
    setError(null);
    setSuccessMsg(null);
  };
  const handleSignInClick = () =>{
    navigate('/signin');
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(validateSignUpForm()){
      const { firstName,lastName,email, password,confirmPassword } = values;
      const response = await signUpUser({firstName,lastName,email, password,confirmPassword});
      if(response.isOk){
        setSuccessMsg("User Registered");
      }else{
        const{message, code} = response.error;
        if(code === "Error"){
          setError("User already exist. Please login.");
        }
      }
    }
  };

  const validateSignUpForm = () => {
    const { firstName,lastName,email, password,confirmPassword } = values;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
    if (firstName.length <=0) {
      setError('First Name is required');
      return false;
    } 
    if (lastName.length <=0) {
      setError('Last Name is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }   
    if (confirmPassword.length < 8) {
      setError('Password and Confirm Password doesnt match');
      return false;
    }  
    if (confirmPassword.length !==password.length) {
      setError('Password and Confirm Password doesnt match');
      return false;
    }
    if(confirmPassword.localeCompare(password)!==0){
      setError('Password and Confirm Password doesnt match');
      return false;
    }     
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={(e) => handleChange(e)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  onChange={(e) => handleChange(e)}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={(e) => handleChange(e)}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  onChange={(e) => handleChange(e)}
                  autoComplete="conf-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick ={handleSignInClick}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
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
      <Snackbar
        open={!!successMsg}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert variant="filled" onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}