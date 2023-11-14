import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Review, Booking } from './dashboard';

import { Box, Button, TextField, Typography, Rating } from '@mui/material';

interface ReviewBoxProps {
  id: string | null;
  onReviewSent: () => void;
}

const labels: { [index: string]: string } = {
  1: 'Very Dissatisfied',
  2: 'Dissatisfied',
  3: 'Neutral',
  4: 'Satisfied',
  5: 'Very Satisfied',
};

function getLabelText (value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const ReviewBox = ({ id, onReviewSent }: ReviewBoxProps) => {
  const listingId: string | null = id;
  const navigate = useNavigate();

  const [reviewText, setReviewText] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [review, setReview] = useState<Review | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hover, setHover] = React.useState(-1);

  // get user info
  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }
  // get token
  const { token } = authContext;
  // get user email
  const user = localStorage.getItem('email');

  // useEffect(() => {
  //   if (!user || !token) {
  //     navigate('/login');
  //   }

  //   getUserBooking();
  // }, [user, token, navigate]);

  if (!listingId) {
    alert('invalid listingId!');
    return <></>;
  }

  // useEffect(() => console.log(reviewRating), [reviewRating]);

  // const getUserBooking = async () => {
  //   const response = await fetch('http://localhost:5005/bookings', {
  //     method: 'GET',
  //     headers: {
  //       'Content-type': 'application/json',
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  //   const data = await response.json();
  //   if (data.error) {
  //     alert(data.error);
  //   } else {
  //     // get all booking Bookingrmation owned by current user
  //     const acceptedBooking = data.bookings.filter((booking: Booking) =>
  //       booking.owner === user &&
  //       booking.status === 'accepted' &&
  //       booking.listingId === listingId);
  //     setBookings(acceptedBooking);
  //   }
  // };

  const sendReview = async () => {
    // check if user logged in
    if (!user || !token) {
      alert('invalid user! Please login first');
      navigate('/login');
      return;
    }

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
      const acceptedBooking = data.bookings.filter((booking: Booking) =>
        booking.owner === user &&
        booking.status === 'accepted' &&
        booking.listingId === listingId);
      console.log('acceptedBooking', acceptedBooking);
      setBookings(acceptedBooking);

      if (!acceptedBooking || acceptedBooking.length === 0 || !acceptedBooking[0]) {
        setReviewText('');
        setReviewRating(0);
        // if the user has no accepted booking
        alert('You have no accepted bookings, can\'t review this listing!');
        return;
      }

      if (!reviewRating || !reviewText) {
        alert('Please make full input!');
        return;
      }

      const reviewToSend: Review = {
        user: user,
        rate: reviewRating,
        comment: reviewText,
        postOn: new Date(),
      };

      // get the first booking as review booking id
      const bookingId = acceptedBooking[0].id;
      try {
        const response = await fetch(`http://localhost:5005/listings/${listingId}/review/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            review: reviewToSend
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send review');
        }

        alert('Review sent successfully!');
        setReviewText('');
        setReviewRating(0);
        onReviewSent();
      } catch (error) {
        alert('Error submitting review: ' + error);
      }
    }
    // console.log('bookings', bookings);

    // if (!reviewRating || !reviewText) {
    //   alert('Please make full input!');
    //   return;
    // }

    // const reviewToSend: Review = {
    //   user: user,
    //   rate: reviewRating,
    //   comment: reviewText,
    //   postOn: new Date(),
    // };

    // // get the first booking as review booking id
    // const bookingId = bookings[0].id;
    // try {
    //   const response = await fetch(`http://localhost:5005/listings/${listingId}/review/${bookingId}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-type': 'application/json',
    //       Authorization: `Bearer ${token}`
    //     },
    //     body: JSON.stringify({
    //       review: reviewToSend
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to send review');
    //   }

    //   alert('Review sent successfully!');
    //   setReviewText('');
    //   setReviewRating(0);
    //   onReviewSent();
    // } catch (error) {
    //   alert('Error submitting review: ' + error);
    // }
  };

  return (
  <>
    <Box sx={{
      width: 800,
      maxWidth: '100%',
      textAlign: 'center',
      margin: 'auto',
    }} >
      <Typography variant='h5'>Reviews</Typography>
      <Typography variant='subtitle1'>How would you rate this listing?</Typography>
      {reviewRating !== null && (
        <Box sx={{ ml: 2, display: 'inline-block' }}>{labels[hover !== -1 ? hover : reviewRating]}</Box>
      )}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
        }}
        >
        <Rating
          name="hover-feedback"
          value={reviewRating}
          getLabelText={getLabelText}
          size="large"
          onChange={(_, newRating) => {
            setReviewRating(Number(newRating));
          }}
          onChangeActive={(_, newHover) => setHover(newHover)}
        />
      </Box><br/>
      <TextField
        id="outlined-multiline-static"
        fullWidth
        multiline
        rows={6}
        placeholder="Leave Comment Here..."
        value={reviewText}
        onChange={(event) => setReviewText(event.target.value)}
        />
    </Box><br/>
    <Box sx={{
      textAlign: 'right',
    }}>
      <Button variant="contained" onClick={sendReview}>Send</Button>
    </Box>
  </>
  );
};

export default ReviewBox;
