import React, { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "react-toastify/dist/ReactToastify.css";
import { Alert, Snackbar } from '@mui/material';
import { loginUser } from '../../service/authService';



const defaultTheme = createTheme();
export default function SignIn() {

  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleClose = () => {
    setError(null);
  };

  const handleSignUpClick = () =>{
    navigate('/signup');
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(()=>{
    if (localStorage.getItem("currentUserData")) {
        navigate("/");
    }
  },[])

  const handleSubmit = async (event) => {
    console.log("inside handle click");
    event.preventDefault();
    setError('');    
    if(validateSignInForm()){
          const { email, password } = values;
          const response = await loginUser({email,password});
          if(response.isOk){
              const result = response.val;
              console.log(`result ${result}`);
              const user = { fullName: result.fullName, userId: result.userId,accessToken:result.accessToken };
              localStorage.setItem("currentUserData",JSON.stringify(user));
              navigate("/");
          }else{
              setError("Failed to login");
          }
       }
        
    }

  const validateSignInForm = () => {
    const { email, password } = values;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }   
    return true;
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => handleChange(e)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => handleChange(e)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick ={handleSignUpClick}>
                  {"Don't have an account? Sign Up"}
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
    </ThemeProvider>
  );
}