import React from 'react'
import { useNavigate } from 'react-router-dom';

interface registerProps {
  token?: string | null;
  setToken: (token: string) => void;
}

function Register (props: registerProps) {
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
        props.setToken(data.token);
        navigate('/dashboard');
      }
    }
  }

  const back = () => {
    navigate('/');
  }

  return (
    <>
      <h2>Register</h2>
      Email:
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
      Password:
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      Check Password:
      <input type="password" value={checkPassword} onChange={e => setCheckPassword(e.target.value)} /><br />
      Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} /><br />
      <button type="button" onClick={back}>Cancel</button>
      <button type="button" onClick={register}>Register</button>
    </>
  )
}

export default Register;
