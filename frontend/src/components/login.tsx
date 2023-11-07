import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';

interface loginProps {
  token?: string | null;
  setToken: (token: string) => void;
}

const Login = (props : loginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.token) {
      navigate('/dashboard');
    }
  }, [props.token]);

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
      props.setToken(data.token);
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
