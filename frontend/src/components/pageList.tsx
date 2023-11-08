import React, { useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import { AuthContext } from '../AuthContext';

const PageList = () => {
  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }

  const { token, setToken } = authContext;
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    // localStorage.removeItem('token');
    localStorage.clear();
    navigate('/dashboard');
  }

  useEffect(() => {
    // if user's information already in local storage
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      setToken(checkToken);
    }
  }, []);

  // const pages = token ? ['Dashboard'] : ['Register', 'Login'];

  return (
    <>
      {token
        ? (
          <>
            <Link to="./dashboard">Dashboard</Link>
            &nbsp;|&nbsp;
            <a href='#' onClick={logout}>Logout</a>
          </>
          )
        : (
          <>
            <Link to="./login">Login</Link>
            &nbsp;|&nbsp;
            <Link to="./register">Register</Link>
          </>
          )
      }

      <hr />

      <Routes>
        {/* <Route path='/' element={<Dashboard />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default PageList;
