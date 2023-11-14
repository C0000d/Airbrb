import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
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

  //
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

  const calculateTimeDiffWithSydney = (dateStr: any) => {
    const parseDateStr = (dateStr: any) => {
      const [datePart, timePart] = dateStr.split(', ');
      const [day, month, year] = datePart.split('/');
      const [time, modifier] = timePart.split(' ');
      const [hours, minutes, seconds] = time.split(':');
      let hours24 = parseInt(hours, 10);
      if (modifier.toLowerCase() === 'pm' && hours24 < 12) {
        hours24 += 12;
      }
      if (modifier.toLowerCase() === 'am' && hours24 === 12) {
        hours24 = 0;
      }
      const standardDateStr = `${year}-${month}-${day}T${String(hours24).padStart(2, '0')}:${minutes}:${seconds}`;
      return new Date(standardDateStr);
    }
    const givenDate = parseDateStr(dateStr);

    // get current local time
    const now = new Date();
    const sydneyTimeOffset = 10 * 60;
    const oneHourInMilliseconds = 3600000;
    const sydneyNow = new Date(now.getTime() + sydneyTimeOffset * 60000 + (now.getTimezoneOffset() * 60000) + oneHourInMilliseconds);

    // time diff
    const diff = sydneyNow.getTime() - givenDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffTime = `${diffDays} days ${diffHours} hours`;

    return diffTime;
  }

  const back = () => {
    navigate('/dashboard');
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
                {/* {index < Booking.length - 1 && <Divider variant="inset" component="li" />} */}
              </React.Fragment>
            ))}
          </List>
        </Box>
    </>
  );
};

export default MyBookings;
