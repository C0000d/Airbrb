import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../AuthContext';

const Register = () => {
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
      alert('Password not match! Please check!')
    } else {
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
        localStorage.setItem('name', name)
        setToken(data.token);
        navigate('/dashboard');
      }
    }
  }

  const back = () => {
    navigate('/dashboard');
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography> <br />
      <TextField label="Email *" type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <br />
      <TextField label="Password *" type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
      <br />
      <TextField label="Check Password *" type="password" value={checkPassword} onChange={e => setCheckPassword(e.target.value)} /> <br />
      <br />
      <TextField label="Name *" type="text" value={name} onChange={e => setName(e.target.value)} /><br />
      <br />
      {/* <button type="button" onClick={back}>Cancel</button> */}
      <Button variant="outlined" onClick={back}>Cancel</Button>
      {/* <button type="button" onClick={register}>Register</button> */}
      <Button variant="contained" onClick={register}>Register</Button>
    </>
  )
}

export default Register;
