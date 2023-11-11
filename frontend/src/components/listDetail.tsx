import React, { SetStateAction, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Rating } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { fetchListingDetails } from './listElement';
import { ListingDetail, Booking, DateRange } from './dashboard';
import { AuthContext } from '../AuthContext';
import isBetween from 'dayjs/plugin/isBetween';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
// import { useNavigate } from 'react-router-dom';

interface AvailabilityDayjs {
  start: Dayjs | null;
  end: Dayjs | null;
}

const countNights = (start: Date | null, end: Date | null) => {
  if (!start || !end) {
    alert('Null date!');
    return 0;
  }

  const oneDay = 1000 * 60 * 60 * 24;

  return Math.ceil((end.valueOf() - start.valueOf()) / oneDay);
};

const ListDetail = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate('/dashboard')
  }
  // get token
  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }

  const { token } = authContext;

  // get listingId from outer router
  const { listingId } = useParams<{ listingId?: string }>();
  const [listing, setListing] = useState<ListingDetail| null>();
  const [availableDayjs, setAvailableDayjs] = useState<AvailabilityDayjs[]>([]);
  const [error, setError] = useState<string | null>();

  // set booking detail
  // get value from datepicker
  const [startDayjs, setStartDayjs] = useState<Dayjs | null>(null);
  const [endDayjs, setEndDayjs] = useState<Dayjs | null>(null);

  // get booking range
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  // get booking price & status
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [bookingStatus, setBookingStatus] = useState('');

  // set review detail
  const [reviews, setReviews] = useState<string | null>('');
  const [rating, setRating] = useState<number | null>(0);

  useEffect(() => {
    // check if listingId is defined
    if (!listingId) {
      alert('Invalid listingId!');
    }

    (async () => {
      try {
        const jsonDetails = await fetchListingDetails(listingId);
        const details: ListingDetail = jsonDetails.listing;
        setListing(details);

        // calculate available dates
        const availableDates = details.availability.map(range => ({
          start: dayjs(range.start),
          end: dayjs(range.end),
        }));
        setAvailableDayjs(availableDates);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error!');
        }
      }
    })();
  }, [listingId]);

  useEffect(() => {
    // calculate total price
    if (listing && startDate && endDate) {
      const nights = countNights(startDate, endDate);
      setTotalPrice(nights * listing.price);
    }
  }, [startDate, endDate, listingId]);

  const isDateUnavailable = (date: Dayjs) => {
    return !availableDayjs.some(range =>
      date.isBetween(range.start, range.end, null, '[]'));
  };

  const makeBooking = async () => {
    if (!token) {
      alert('Please login first!');
      return;
    }

    if (!listing) {
      alert('Invalid listing!');
      return;
    }

    if (!startDate || !endDate || (startDate > endDate)) {
      alert('The date is invalid, please try again!');
      return;
    }
    const user = localStorage.getItem('email')
    if (listing.owner === user) {
      alert('You can not book your own listing!');
      return;
    }

    const totalNights = countNights(startDate, endDate);
    const newTotalPrice = totalNights * listing.price;
    setTotalPrice(newTotalPrice);
    // console.log(newTotalPrice);
    try {
      // console.log(startDate?.toISOString());
      const response = await fetch(`http://localhost:5005/bookings/new/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateRange: { start: startDate?.toISOString(), end: endDate?.toISOString(), },
          totalPrice: newTotalPrice
        })
      });

      // if (!response.ok) {
      //   alert(`HTTP error! status: ${response.status}`);
      // }

      const data = await response.json();
      alert('Booking has been sent! Please wait for owner\'s response.');
      navigate('/dashboard')
      return data;
    } catch (error) {
      alert(`Booking failed: ${error}`);
    }
  };

  // if error exists
  if (error) {
    return <>Error: {error}</>;
  }
  // if get invalid listing
  if (!listing) {
    return <>Loading...</>;
  }
  // console.log('available dates', listing.availability);
  // console.log('available dates', availableDayjs);

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        {/* <img src={listing.thumbnail || require('./defaultImg.png')} alt='listing image' /> */}
        <Card sx={{ boxShadow: 0 }}>
          <CardMedia
            component="img"
            height='auto'
            image={listing.thumbnail || require('./defaultImg.png')}
            alt="Thumbnail Image"
            sx={{
              width: '50%',
              marginLeft: 'auto',
              marginRight: 'auto',
              height: 'auto'
            }}
          />
        </Card>
        <Typography variant='h5'>Title: {listing.title}</Typography>
        <Typography variant='subtitle1'>Address: {listing.address} &nbsp;&nbsp;| &nbsp;&nbsp;No. of beds: {listing.metadata.beds}</Typography>
        <Typography variant='body1' >Owned By: {listing.owner} &nbsp;&nbsp;| &nbsp;&nbsp;Amenities: {listing.metadata.amenities} <br />
          No. of bathrooms: {listing.metadata.bathrooms} <br />
        No. of bedrooms: {listing.metadata.bedrooms} &nbsp;&nbsp;| &nbsp;&nbsp;Type: {listing.metadata.type}<br /></Typography>
      </Box>
      {/* <Typography variant='h4'>{listing.title}</Typography>
      <Typography variant='subtitle1'>{listing.address}</Typography>
      <Typography variant='body1' >Owned By: {listing.owner}</Typography> */}

      {/* booking area */}
      {/* <Typography variant='h5'>Booking</Typography> */}
      <br/>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        <Typography variant='h5'>Booking:</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="Start Date *"
              disablePast
              shouldDisableDate={isDateUnavailable}
              value={startDayjs}
              onChange={(newValue) => {
                setStartDayjs(newValue);
                setStartDate(newValue ? newValue.toDate() : null);
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="End Date *"
              disablePast
              shouldDisableDate={isDateUnavailable}
              value={endDayjs}
              onChange={(newValue) => {
                setEndDayjs(newValue);
                setEndDate(newValue ? newValue.toDate() : null);
              }}
              />
          </DemoContainer>
        </LocalizationProvider>
        <br/>
        <Button variant="contained" type="submit" onClick={makeBooking}>Make Booking</Button>
      </Box>
      {/* <hr /> */}
    <Typography>Booking Confimation</Typography>

      {/* reviewing area: display and send review */}
      {/* <Typography variant='h5'>Reviews</Typography> */}
      <Box sx={{
        width: 800,
        maxWidth: '100%',
        textAlign: 'center',
        margin: 'auto',
      }} >
        <Typography variant='h5'>Reviews:</Typography>
        <Rating name="no-value" value={null} size="large" />
        <TextField
            id="outlined-multiline-static"
            fullWidth
            multiline
            rows={6}
            placeholder="Leave Comment Here..."
          />
      </Box>
      <Box sx={{
        textAlign: 'right',
      }}>
        <Button variant="contained">Send</Button>
      </Box>
    </>
  );
}

export default ListDetail;
