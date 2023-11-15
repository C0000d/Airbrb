import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

interface DateRange {
  start: string;
  end: string;
}
interface Booking {
  id: string;
  listingId: string;
  owner: string;
  totalPrice: string;
  status: string;
  dateRange: DateRange;
}
const BookRequest = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate('/hostedListing')
  }
  const listingId = localStorage.getItem('listingId');
  const token = localStorage.getItem('token');
  const [info, setInfo] = useState([]);
  const [detail, setDetail] = useState({ title: '', thumbnail: '', address: '', metadata: { type: '', beds: '', bedrooms: '', amenities: '', bathrooms: '' }, price: '', reviews: [], published: false, postedOn: '' });
  const [title, setTitle] = React.useState('');
  const [img, setImg] = React.useState('');
  const [postedOn, setPostedOn] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [profit, setProfit] = React.useState(0);
  const [day, setDay] = React.useState(0);
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
      setPrice(data.listing.price);
      if (data.listing.postedOn === null) {
        setPostedOn('Not Poseted yet')
        setDiff('Not Poseted yet')
      } else {
        setPostedOn((sydneyTimeFormatter.format(new Date(data.listing.postedOn))));
        const timeDiff = calculateTimeDiffWithSydney((sydneyTimeFormatter.format(new Date(data.listing.postedOn))));
        setDiff(timeDiff)
        const days = profit / parseInt(price)
        setDay(days)
      }
      // setPostedOn((sydneyTimeFormatter.format(new Date(data.listing.postedOn))));
      // const timeDiff = calculateTimeDiffWithSydney((sydneyTimeFormatter.format(new Date(data.listing.postedOn))));
      // setDiff(timeDiff)
      // const days = profit / parseInt(price)
      // setDay(days)
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
        const filteredInfo = data.bookings.filter((booking: Booking) => Number(booking.listingId) === Number(listingId));
        setInfo(filteredInfo);
        const acceptBooking = data.bookings.filter((booking: Booking) => (Number(booking.listingId) === Number(listingId)) && (booking.status === 'accepted'));
        let profits = 0;
        for (const booking of acceptBooking) {
          profits += parseInt(booking.totalPrice)
        }
        setProfit(profits)
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

  const accept = async (id: string) => {
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
    }
  }
  const deny = async (id: string) => {
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
    }
  }
  const [diff, setDiff] = React.useState('');
  const calculateTimeDiffWithSydney = (dateStr: string) => {
    if (dateStr === null || dateStr === '') {
      return 'Not Poseted yet';
    } else {
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
    // const parseDateStr = (dateStr: any) => {
    //   const [datePart, timePart] = dateStr.split(', ');
    //   const [day, month, year] = datePart.split('/');
    //   const [time, modifier] = timePart.split(' ');
    //   const [hours, minutes, seconds] = time.split(':');
    //   let hours24 = parseInt(hours, 10);
    //   if (modifier.toLowerCase() === 'pm' && hours24 < 12) {
    //     hours24 += 12;
    //   }
    //   if (modifier.toLowerCase() === 'am' && hours24 === 12) {
    //     hours24 = 0;
    //   }
    //   const standardDateStr = `${year}-${month}-${day}T${String(hours24).padStart(2, '0')}:${minutes}:${seconds}`;
    //   return new Date(standardDateStr);
    // }
    // const givenDate = parseDateStr(dateStr);
    // // get current local time
    // const now = new Date();
    // const sydneyTimeOffset = 10 * 60;
    // const oneHourInMilliseconds = 3600000;
    // const sydneyNow = new Date(now.getTime() + sydneyTimeOffset * 60000 + (now.getTimezoneOffset() * 60000) + oneHourInMilliseconds);
    // // time diff
    // const diff = sydneyNow.getTime() - givenDate.getTime();
    // const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    // const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const diffTime = `${diffDays} days ${diffHours} hours`;
    // return diffTime;
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
          PostedOn: {postedOn} <br />
          So far: {diff} <br />
          Total Days booked: {profit / parseInt(price)}<br />
          Total Profits: {profit}
      </Typography>
        <List sx={{ margin: 'auto', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {info.map((booking: Booking) => (
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
            </React.Fragment>
          ))}
        </List>
      </Box>
    </>
  )
}

export default BookRequest;
