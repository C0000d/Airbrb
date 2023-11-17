import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Review, ListingDetail } from './dashboard';
import { fetchListingDetails } from './listElement';
import { Box, Typography, Rating, Card, CardContent, Divider } from '@mui/material';

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
