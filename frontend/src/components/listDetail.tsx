import React, { SetStateAction, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Rating } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { fetchListingDetails } from './listElement';
import { ListingDetail, Booking, DateRange } from './dashboard';
import { AuthContext } from '../AuthContext';
import isBetween from 'dayjs/plugin/isBetween';

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

    const totalNights = countNights(startDate, endDate);
    const newTotalPrice = totalNights * listing.price;
    setTotalPrice(newTotalPrice);
    try {
      console.log('listing price', listing.price);
      console.log('total night:', totalNights);
      console.log('total price:', totalPrice);
      console.log('date range', { start: startDate, end: endDate });

      const response = await fetch(`http://localhost:5005/bookings/new/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateRange: { start: startDate, end: endDate },
          totalPrice: newTotalPrice
        })
      });

      if (!response.ok) {
        alert(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert('Booking has been sent! Please wait for owner\'s response.');
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
  console.log('available dates', listing.availability);
  console.log('available dates', availableDayjs);
  return (
    <>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          textAlign: 'center',
        }}
      >
        <img src={listing.thumbnail || require('./defaultImg.png')} alt='listing image'/>
      </Box>
      <Typography variant='h4'>{listing.title}</Typography>
      <Typography variant='subtitle1'>{listing.address}</Typography>
      <Typography variant='body1' >Owned By: {listing.owner}</Typography>

      {/* booking area */}
      <Typography variant='h5'>Booking</Typography>
      <br/>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
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
        <Button type="submit" onClick={makeBooking}>Make Booking</Button>
      </Box>
    <Typography>Booking Confimation</Typography>

      {/* reviewing area: display and send review */}
      <Typography variant='h5'>Reviews</Typography>
      <Box sx={{
        width: 800,
        maxWidth: '100%',
        textAlign: 'center',
        margin: 'auto',
      }} >
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
        <Button >Send</Button>
      </Box>
    </>
  );
}

export default ListDetail;
