import React, { useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import HostedListings from './hostedListing';
import ListDetail from './listDetail';
import MyBookings from './myBookings';
import ReviewPage from './advancedReviews';
import { AuthContext } from '../AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

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
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
  return (
    <>
      {/* <AppBar position="static">
        <Container maxWidth="xl"> */}
          <Toolbar disableGutters>
            <Search sx={{ border: '1px solid black', borderRadius: '6px' }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
        </Search>
        {/* <Box sx={{ textAlign: 'right' }}> */}
        <Typography
        // variant="h6"
        // noWrap
        // component="div"
        sx={{ textAlign: 'right', flexGrow: 1 }}
      >
      {token
        ? (
          <>
            <Link to="./dashboard">Homepage</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="./hostedListing" >Hosted Listings</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="./myBookings" >My Bookings</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="./dashboard" onClick={logout}>Logout</Link>
          </>
          )
        : (
          <>
            <Link to="./login">Login</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="./register">Register</Link>
          </>
          )
          }
          </Typography>
          {/* </Box> */}
      </Toolbar>
      {/* </Container>
      </AppBar> */}

      <hr />

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/myBookings' element={<MyBookings />} />
        <Route path='/reviewPage/:listingId' element={<ReviewPage />} />
        <Route path='/hostedListing/*' element={<HostedListings key={new Date().toISOString()} />} />
        <Route path='/listings/:listingId' element={<ListDetail />} />
        </Routes>
    </>
  );
}

export default PageList;
