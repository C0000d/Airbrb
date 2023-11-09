import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import HostedListings, { getAllListings } from './hostedListing';
// import HostedListings from './hostedListing';
import ListDetail from './listDetail';
import { AuthContext } from '../AuthContext';
// import getAllListings from './hostedListing';
// import HostedDetail from './hostedLIstDetail'

// const LandingPage = () => {
//   return <>Hi</>;
// }

const PageList = () => {
  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }

  const { token, setToken } = authContext;
  const navigate = useNavigate();

  const logout = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setToken(null);
      localStorage.clear();
      alert('Successfully logout!')
      navigate('/dashboard');
    }
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
      {/* {console.log(token)} */}
      {token
        ? (
          <>
            <Link to="./dashboard">Dashboard</Link>
            &nbsp;|&nbsp;
            <Link to="./hostedListing" onClick={getAllListings}>Hosted Listings</Link>
            &nbsp;|&nbsp;
            <Link to="./dashboard" onClick={logout}>Logout</Link>
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
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/hostedListing/*' element={<HostedListings />} />
        <Route path='/listings/:listingId' element={<ListDetail />} />
        {/* <Route path='/hostedLIstDetail' element={<HostedDetail />} /> */}
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default PageList;
