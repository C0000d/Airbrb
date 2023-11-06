import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface loginProps {
  token?: string | null;
  setToken: (token: string) => void;
}

function Login (props : loginProps) {
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
      props.setToken(data.token);
      navigate('/dashboard');
    }
  };

  const back = () => {
    navigate('/');
  }

  return (
    <>
      <h2>Login</h2>
      Email:
      <input type="text" value={email} onChange={ e => setEmail(e.target.value)}/> <br />
      Password:
      <input type="password" value={password} onChange={ e => setPassword(e.target.value)}/> <br />
      <button type="button" onClick={back}>Cancel</button>
      <button type="button" onClick={login}>Login</button>
    </>
  );
}

export default Login;
