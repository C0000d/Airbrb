import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import { AuthContext } from '../AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }

  const { token, setToken } = authContext;

  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token]);

  const login = async () => {
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email, password
      }),
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      setToken(data.token);
      navigate('/dashboard');
    }
  };

  const back = () => {
    navigate('/dashboard');
  }

  return (
    <>
      <Typography variant='h4'>Login</Typography>
      <br/>
      <TextField type="text" variant='outlined' label='Email Address *' value={email} onChange={ e => setEmail(e.target.value)}/> <br />
      <br/>
      <TextField type="password" variant='outlined' label='Password *' value={password} onChange={ e => setPassword(e.target.value)}/> <br />
      <br/>
      <Button variant='outlined' type="button" onClick={back}>Cancel</Button>
      <Button variant='contained' type="button" onClick={login}>Login</Button>
    </>
  );
}

export default Login;
