import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchListingDetails, getReviewRate } from './listElement';
import { ListingDetail, Review } from './dashboard';
import ReviewBox from './makingReview';
import ReviewArea from './showingReview';
import RatingPopover from './ratingPopover';
import embedVideoUrl from './embedVideo';
import { Box, Button, Typography, Rating, Popover } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AuthContext } from '../AuthContext';
import isBetween from 'dayjs/plugin/isBetween';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CircularProgress } from '@mui/joy';
import ClickAwayListener from '@mui/material/ClickAwayListener';
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
  const location = useLocation();
  const { from } = location.state || {};
  const back = () => {
    if (from === 'search') {
      navigate('/search');
    } else {
      navigate('/dashboard');
    }
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

  // get booking price & status
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // set reviews of the listing
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalRate, setTotalRate] = useState<number>(0);

  // popover control
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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

    updateReviews();
  }, [listingId]);

  useEffect(() => {
    // calculate total price
    if (listing && startDate && endDate) {
      const nights = countNights(startDate, endDate);
      setTotalPrice(nights * listing.price);
    }
  }, [startDate, endDate, listingId]);

  useEffect(() => {
    const newTotalRate = +getReviewRate(reviews); // convert string to number
    setTotalRate(newTotalRate);
  }, [reviews]);

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
    const user = localStorage.getItem('email')
    if (listing.owner === user) {
      alert('You can not book your own listing!');
      return;
    }
    if (!startDate || !endDate || (startDate > endDate)) {
      alert('The date is invalid, please try again!');
      return;
    }
    // const user = localStorage.getItem('email')
    // if (listing.owner === user) {
    //   alert('You can not book your own listing!');
    //   return;
    // }

    const totalNights = countNights(startDate, endDate);
    const newTotalPrice = totalNights * listing.price;
    setTotalPrice(newTotalPrice);

    try {
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

  const updateReviews = async () => {
    try {
      const jsonData = await fetchListingDetails(listingId);
      const data: ListingDetail = jsonData.listing;

      // console.log('reviews in update', data.reviews);
      setListing(data);
      setReviews(data.reviews);
    } catch (error) {
      alert(`Error: can't get listing detail: ${error}`);
    }
  }

  if (error) {
    return (
      <>
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography variant='h6'>Error: {error}</Typography>
        </Box>
      </>
    );
  }
  // if get invalid listing
  if (!listing) {
    return (
      <>
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <CircularProgress size="lg" />
          <Typography variant='h6'>Loading...</Typography>
        </Box>
      </>
    );
  }

  // handle popover
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'listingRating' : undefined;

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Box
        sx={{
          // width: '80%',
          maxWidth: '100%',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        {listing.metadata.video
          ? (
            <Box sx={{ maxWidth: '100%', width: 500, textAlign: 'center', margin: 'auto' }}>
              <iframe
                width="100%"
                height="300"
                src={embedVideoUrl(listing.metadata.video)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              >
              </iframe>
            </Box>
            )
          : (
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
            )
        }
        <br/>
        <Typography variant='h5'>Title: {listing.title}</Typography>
        <br/>
        <Typography variant='button'>Address: {listing.address} &nbsp;&nbsp;| &nbsp;&nbsp;No. of beds: {listing.metadata.beds}</Typography>
        <br/>
        <Typography variant='button' >Owned By: {listing.owner} &nbsp;&nbsp;| &nbsp;&nbsp;Amenities: {listing.metadata.amenities} <br />
          No. of bathrooms: {listing.metadata.bathrooms} &nbsp;&nbsp;| &nbsp;&nbsp;Price: {listing.price} <br />
        No. of bedrooms: {listing.metadata.bedrooms} &nbsp;&nbsp;| &nbsp;&nbsp;Type: {listing.metadata.type}<br /></Typography>
      </Box>
      <br/>
      <Box
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          display: 'flex',
          marginBottom: 1,
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Rating
          value={totalRate} precision={0.1}
          size='large'
          readOnly
        />
        <Typography variant='h6'>{totalRate} / 5</Typography>
      </Box>
      {/* <ClickAwayListener onClickAway={handlePopoverClose}> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
      >
        <RatingPopover id={listingId} reviews={reviews} />
      </Popover>
      {/* </ClickAwayListener> */}
      <br/>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        <Typography variant='h5'>Booking</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              sx={{ width: '100%' }}
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
              sx={{ width: '100%' }}
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
        <Typography variant='overline'>
          {(!isNaN(totalPrice) && totalPrice >= 0) ? 'Total Price: ' + totalPrice.toString() : 'Wrong date!'}
        </Typography>
        {/* Total Price: {totalPrice >= 0 ? totalPrice : 'Wrong date!'} */}
        <br/>
        <Button variant="contained" type="submit" onClick={makeBooking}>Make Booking</Button>
      </Box>
      {/* <hr /> */}
      <br/>
      {/* reviewing area: display and send review */}
      {listingId && <ReviewBox id={listingId} onReviewSent={updateReviews}/>}
      <Typography variant='h5'>Reviews</Typography>
      {listingId && <ReviewArea id={listingId} reviews={reviews}/>}
    </>
  );
}

export default ListDetail;
