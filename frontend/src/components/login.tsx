import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface loginProps {
  token?: string | null;
  setToken: (token: string) => void;
}

function Login (props : loginProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  if (props.token) {
    navigate('/dashboard');
  }

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

  return (
    <>
      <h2>Login</h2>
      Email:
      <input type="text" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
      Password:
      <input type="text" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>

      <button type="button" onClick={login}>Login</button>
    </>
  );
}

export default Login;
