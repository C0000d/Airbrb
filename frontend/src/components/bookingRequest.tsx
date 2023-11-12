import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography, Rating } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

const BookRequest = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate('/hostedListing')
  }
  const listingId = localStorage.getItem('listingId');
  const token = localStorage.getItem('token');
  const [info, setInfo] = useState([]);
  // let info = []
  const [detail, setDetail] = useState({ title: '', thumbnail: '', address: '', metadata: { type: '', beds: '', bedrooms: '', amenities: '', bathrooms: '' }, price: '', reviews: [], published: false, postedOn: '' });
  const [title, setTitle] = React.useState('');
  const [img, setImg] = React.useState('');
  const [postedOn, setPostedOn] = React.useState('');
  const getDetail = async () => {
    const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setDetail(data.listing);
      setTitle(data.listing.title);
      setImg(data.listing.thumbnail);
      setPostedOn(data.listing.postedOn);
      setPostedOn((sydneyTimeFormatter.format(new Date(data.listing.postedOn))));
      // {sydneyTimeFormatter.format(new Date(data.listing.postedOn))}
    }
  }

  useEffect(() => {
    const getAllRequest = async () => {
      const res = await fetch('http://localhost:5005/bookings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        // info = data.bookings.filter((booking: any) => Number(booking.listingId) === Number(listingId));
        const filteredInfo = data.bookings.filter((booking: any) => Number(booking.listingId) === Number(listingId));
        setInfo(filteredInfo);
        // console.log(info)
      }
    }
    getAllRequest();
    getDetail();
  }, []);
  const sydneyTimeFormatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const accept = async (id: any) => {
    // console.log(id)
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5005/bookings/accept/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Successfully Accept a booking!');
      navigate(`/hostedListing/bookRequest/:${listingId}`)
      // navigate('/hostedListing');
    }
  }
  const deny = async (id: any) => {
    // console.log(id)
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5005/bookings/decline/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Successfully Decline a booking!');
      navigate(`/hostedListing/bookRequest/:${listingId}`)
      // navigate('/hostedListing');
    }
  }

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          margin: 'auto',
          textAlign: 'center'
        }}
      >
      <Typography variant="h5" gutterBottom>
          Listing Title: {title} <br />
        </Typography>
        <Typography variant="h6" gutterBottom>
          PostedOn: {postedOn}
          {/* {sydneyTimeFormatter.format(new Date(postedOn))} */}
      </Typography>
        <List sx={{ margin: 'auto', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {info.map((booking: any) => (
              <React.Fragment key={booking.id}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="thumbnail img" src={img || require('./defaultImg.png')} />
        </ListItemAvatar>
        <ListItemText
          primary={`Booking owner: ${booking.owner}`}
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
              >
                Date Range: <br />&nbsp;&nbsp;From: {sydneyTimeFormatter.format(new Date(booking.dateRange.start))} <br /> &nbsp;&nbsp;To: {sydneyTimeFormatter.format(new Date(booking.dateRange.end))} <br />
                Total Price: {booking.totalPrice} <br />
                Booking Status: {booking.status}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Box sx={{ textAlign: 'right' }}>
        <Button onClick={() => accept(booking.id)} variant="contained" type="button" style={{ marginRight: 40, marginBottom: 10 }}>Accept</Button>
        <Button onClick={() => deny(booking.id)} variant="outlined" type="button" style={{ marginRight: 40, marginBottom: 10 }}>Decline</Button>
      </Box>
      <Divider variant="inset" component="li" />
      {/* {index < info.length - 1 && <Divider variant="inset" component="li" />} */}
    </React.Fragment>
          ))}
</List>
        {/* <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
            <Avatar alt="thumbnail img" src={img || require('./defaultImg.png')} />
        </ListItemAvatar>
        <ListItemText
          primary="Booking owner:"
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Date Range: <br />
                Total Price: <br />
                Booking Status:
              </Typography>
            </React.Fragment>
          }
        />
          </ListItem>
          <Box sx={{
            textAlign: 'right'
          }}>
          <Button variant="contained" type="button" style={{ marginRight: 40, marginBottom: 10 }}>Accept</Button>
            <Button variant="outlined" type="button" style={{ marginRight: 40, marginBottom: 10 }}>Deny</Button>
            </Box>
        <Divider variant="inset" component="li" />
        </List> */}
      {/* <br /> */}
      </Box>
    </>
  )
}

export default BookRequest;
