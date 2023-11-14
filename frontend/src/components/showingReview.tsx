import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Review, Booking, ListingDetail } from './dashboard';
import { fetchListingDetails } from './listElement';
import { Box, Button, TextField, Typography, Rating, Card, CardContent, Divider } from '@mui/material';
// import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse } from '@mui/material';

interface ReviewAreaProps {
  id: string | null;
  reviews: Review[];
}

const labels: { [index: number]: string } = {
  1: 'Very Dissatisfied',
  2: 'Dissatisfied',
  3: 'Neutral',
  4: 'Satisfied',
  5: 'Very Satisfied',
};

const ReviewArea = ({ id, reviews }: ReviewAreaProps) => {
  const listingId: string | null = id;
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  // const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!listingId) {
      alert('Invalid listingId! Please try again.');
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const jsonData = await fetchListingDetails(listingId);
        const data: ListingDetail = jsonData.listing;
        setListing(data);
        // setReviews(data.reviews);
      } catch (error) {
        alert(`Error: can't get listing detail: ${error}`);
      }
    };

    fetchData();
  }, [listingId]);

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

  if (!reviews || reviews.length === 0) {
    return (
      <>
        <br/><br/>
        <Box sx={{
          display: 'flex',
          alignitems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant='subtitle2'>There are no comments yet!</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        {[...reviews].reverse().map((review, index) => (
          <Card key={index} sx={{
            width: '95%',
            padding: 2,
          }}>
            <Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <Typography variant='subtitle2'>{review.user}</Typography>
                <Rating name="read-only" value={review.rate} size="small" readOnly />
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <Typography variant="caption" color="text.secondary">{sydneyTimeFormatter.format(new Date(review.postOn))}</Typography>
                <Typography variant="caption" color="text.secondary">{labels[review.rate]}</Typography>
              </Box>
            </Box>
            <Divider light />
            <CardContent>
              <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
            </CardContent>
        </Card>
        ))}
      </Box>
    </>
  );
};

export default ReviewArea;
export { labels };
