import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Rating } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { fetchListingDetails } from './listElement';
import { ListingDetail, Booking } from './dashboard';
import { AuthContext } from '../AuthContext';

const ListDetail = () => {
  // get listingId from outer router
  const { listingId } = useParams<{ listingId?: string }>();
  const [listing, setListing] = useState<ListingDetail| null>();
  const [error, setError] = useState<string | null>();

  // set booking detail
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  // set review detail
  const [reviews, setReviews] = useState('');
  const [rating, setRating] = useState(0);

  // display thumbnail
  let thumbnail = 'defaultImg.png';

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

        thumbnail = details.thumbnail;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error!');
        }
      }
    })();
  }, [listingId]);

  const sendComment = () => {
    // check if logged in
    const authContext = useContext(AuthContext);
    // check if authContext works
    if (!authContext) {
      throw new Error('authContext not available!');
    }

    const { token } = authContext;

    if (!token) {
      alert('Please loggin first!');
    }

    // if logged in, check booking status
  };

  // if error exists
  if (error) {
    return <>Error: {error}</>;
  }
  // if get invalid listing
  if (!listing) {
    return <>Loading...</>;
  }
  return (
    <>
      <img src={listing.thumbnail} alt='listing image'/>
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
        <form>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Start Date *" />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="End Date *" />
          </DemoContainer>
        </LocalizationProvider>
        <br/>
        <Button type="submit">Make Booking</Button>
        </form>
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
        <Button onClick={sendComment}>Send</Button>
      </Box>
    </>
  );
}

export default ListDetail;
