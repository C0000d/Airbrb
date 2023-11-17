import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Register = () => {
  // set state for register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('')
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }

  const { token, setToken } = authContext;

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token]);

  const register = async () => {
    if (password !== checkPassword) {
      alert('Password not match! Please check!');
      return;
    }

    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email, password, name
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
      localStorage.setItem('name', name);
      setToken(data.token);
      navigate('/dashboard');
    }
  }

  const back = () => {
    navigate('/dashboard');
  }

  return (
    <>
      <Box sx={{
        width: 500,
        maxWidth: '100%',
        textAlign: 'center',
        margin: 'auto',
      }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <br/>
        <TextField data-cy="register-email-input" fullWidth label="Email *" type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <br/>
        <TextField data-cy="register-password-input" fullWidth label="Password *" type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
        <br/>
        <TextField data-cy="register-checkpassword-input" fullWidth label="Check Password *" type="password" value={checkPassword} onChange={e => setCheckPassword(e.target.value)} /> <br />
        <br/>
        <TextField data-cy="register-name-input" fullWidth label="Name *" type="text" value={name} onChange={e => setName(e.target.value)} /><br />
        <br/>
        <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Cancel</Button>
        <Button data-cy="register-submit-button" variant="contained" type="button" onClick={register} style={{ marginBottom: 10 }}>Register</Button>
      </Box>
    </>
  );
};

export default Register;
