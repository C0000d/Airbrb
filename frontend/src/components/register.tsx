import React from 'react'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
interface registerProps {
  token?: string | null;
  setToken: (token: string) => void;
}

const Register = (props: registerProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [checkPassword, setCheckPassword] = React.useState('')
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.token) {
      navigate('/dashboard');
    }
  }, [props.token]);

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
        props.setToken(data.token);
        navigate('/dashboard');
      }
    }
  }

  const back = () => {
    navigate('/dashboard');
  }

  return (
    <>
        <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography> <br />
        <TextField fullWidth label="Email *" type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <br />
        <TextField fullWidth label="Password *" type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Check Password *" type="password" value={checkPassword} onChange={e => setCheckPassword(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Name *" type="text" value={name} onChange={e => setName(e.target.value)} /><br />
        <br />
        <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Cancel</Button>
        <Button variant="contained" type="button" onClick={register} style={{ marginBottom: 10 }}>Register</Button>
      </Box>
    </>
  )
}

export default Register;
