import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ListingDetail, Booking } from './dashboard';
import { Box, Button, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

type BookingListing = Record<string, ListingDetail>;

const MyBookings = () => {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }
  // get token
  const { token } = authContext;
  // get user email
  const user = localStorage.getItem('email');

  // set booking details
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState<BookingListing>({});

  useEffect(() => {
    const getUserBooking = async () => {
      const response = await fetch('http://localhost:5005/bookings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        // get all booking Bookingrmation owned by current user
        const filteredBooking = data.bookings.filter((booking: Booking) => booking.owner === user);
        setBookings(filteredBooking);
      }
    }
    getUserBooking();
  }, [user]);

  // if bookings updated, fetch new listings
  useEffect(() => {
    bookings.forEach(async (booking: Booking) => {
      const listingDetails = await getDetail(booking.listingId);
      setListings(prev => ({ ...prev, [booking.listingId]: listingDetails }));
    });
  }, [bookings]);

  const getDetail = async (listingId: string) => {
    const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      return data.listing;
    }
  };

  const sydneyTimeFormatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const back = () => {
    navigate('/dashboard');
  }

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Box sx={{
        width: 500,
        maxWidth: '100%',
        margin: 'auto',
        textAlign: 'center'
      }}>
        <List sx={{ margin: 'auto', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {bookings.map((booking: Booking) => (
            <React.Fragment key={booking.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="thumbnail img" src={listings[booking.listingId]?.thumbnail || require('./defaultImg.png')} />
              </ListItemAvatar>
              <ListItemText
                primary={`Listing: ${listings[booking.listingId]?.title}`}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Date Range: <br />
                      &nbsp;&nbsp;From: {booking.dateRange.start ? sydneyTimeFormatter.format(new Date(booking.dateRange.start)) : 'Not available'} <br />
                      &nbsp;&nbsp;To: {booking.dateRange.end ? sydneyTimeFormatter.format(new Date(booking.dateRange.end)) : 'Not available'} <br />
                      Total Price: {booking.totalPrice} <br />
                      Listing owner: {listings[booking.listingId]?.owner} <br />
                      Booking Status: {booking.status}
                    </Typography>
                  </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </>
  );
};

export default MyBookings;
