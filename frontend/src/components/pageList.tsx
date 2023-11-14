import React, { useEffect, useContext, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import SearchPage from './search';
import HostedListings from './hostedListing';
import ListDetail from './listDetail';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

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
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen(false);
  };
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const handleSearch = () => {
    // console.log()
    // localStorage.removeItem('stitle');
    // localStorage.removeItem('scity');
    // localStorage.removeItem('email');
    if (searchTitle === null) {
      setSearchTitle('')
    }
    if (searchCity === null) {
      setSearchCity('')
    }
    navigate('/search', { state: { from: 'searchfilter', stitle: searchTitle, scity: searchCity } });
  }
  return (
    <>
      {/* <AppBar position="static">
        <Container maxWidth="xl"> */}
          <Toolbar disableGutters>
            <Search onClick={handleClickOpen} sx={{ border: '1px solid black', borderRadius: '6px' }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
        </Search>
        <React.Fragment>
          <Dialog open={open} onClose={handleClose1}>
            <DialogTitle>Search</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Search the listings you want...
              </DialogContentText>
              <TextField
                // autoFocus
                margin="dense"
                label="Listing Title"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setSearchTitle(e.target.value)}
              />
              <TextField
                margin="dense"
                label="City"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <DialogContentText>
                <br />Number of bedrooms:
              </DialogContentText>
              <TextField
                margin="dense"
                label="Min No."
                type="text"
                // fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Max No."
                type="text"
                // fullWidth
                variant="standard"
              />
              <DialogContentText>
                <br />Price(per night):
              </DialogContentText>
              <TextField
                margin="dense"
                label="Min Price"
                type="text"
                // fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Max Price"
                type="text"
                // fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose1}>Cancel</Button>
              <Button onClick={() => { handleClose1(); handleSearch(); } }>Search</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
        {auth && (
            <div style={{ textAlign: 'right', flexGrow: 1 }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
      {token
        ? (
        <>
            <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
          <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); } }>
            &nbsp;&nbsp;<Link to="./dashboard">Homepage</Link> </MenuItem>
          <MenuItem onClick={() => { navigate('/hostedListing'); handleClose(); } }>
            &nbsp;&nbsp;<Link to="./hostedListing" >Hosted Listings</Link>&nbsp;&nbsp; </MenuItem>
          <MenuItem onClick={() => { handleClose(); logout(); navigate('/dashboard'); }}>
                        &nbsp;&nbsp;<Link to="./dashboard" >Logout</Link>&nbsp;&nbsp;</MenuItem>
            </Menu>
        </>
          )
        : (
          <>
            <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
          <MenuItem onClick={() => { navigate('/login'); handleClose(); } }>
            &nbsp;&nbsp;<Link to="./login">Login&nbsp;</Link>&nbsp;&nbsp; </MenuItem>
          <MenuItem onClick={() => { navigate('/register'); handleClose(); } }>
            &nbsp;&nbsp;<Link to="./register">Register</Link> &nbsp;&nbsp;</MenuItem>
          </Menu>
        </>
          )
          }
        </div>
        )}
      </Toolbar>
      {/* </Container>
      </AppBar> */}

      <hr />

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/hostedListing/*' element={<HostedListings key={new Date().toISOString()} />} />
        <Route path='/listings/:listingId' element={<ListDetail />} />
        <Route path='/search' element={<SearchPage key={new Date().toISOString()} />} />
        </Routes>
    </>
  );
}

export default PageList;
