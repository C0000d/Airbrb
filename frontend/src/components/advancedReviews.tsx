import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getReviewRate } from './listElement';
import { Review, Booking, ListingDetail } from './dashboard';
import ReviewArea from './showingReview';
import { reviewClassification, classifyReviews } from './ratingPopover';
import { Button, Box, Typography, Rating, Divider, Stack } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();
  const [targetRating, setTargetRating] = useState<number>(0);
  const [targetReview, setTargetReview] = useState<Review[]>([]);

  if (!location.state) {
    alert('Failed to navigate review page, try again!');
    navigate('/dashboard');
  }

  // get previous path
  const previousPath = location.state.from || `/listings/${listingId}`;

  const { rating, reviews } = location.state || {};
  const totalRate = +getReviewRate(reviews); // convert string to number
  const totalReviewCount = reviews.length;
  const classifiedReview: reviewClassification = classifyReviews(reviews);
  const ratingDistribution: number[] = [];

  [1, 2, 3, 4, 5].forEach((ratingNumber) => {
    ratingDistribution.push(Math.round(classifiedReview[ratingNumber as keyof reviewClassification].length * 100 / totalReviewCount))
  });

  useEffect(() => {
    if (location.state) {
      const { rating, reviews } = location.state;
      // get reviews with target rating
      setTargetRating(rating);
      setTargetReview(classifyReviews(reviews)[rating as keyof reviewClassification]);
    }
  }, [location.state]);

  const reloadReviewArea = (rating: number) => {
    setTargetRating(rating);
    setTargetReview(classifyReviews(reviews)[rating as keyof reviewClassification]);
  };

  const back = () => {
    navigate(previousPath);
  }

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Typography variant='h5'>Reviews Statistics</Typography>
      <br/>
      <Box sx={{
        display: 'flex',
        marginBottom: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <Rating value={totalRate} precision={0.1} size='large' readOnly />
        <Typography variant='h6'>{totalRate} out of 5</Typography>
      </Box>
      <Typography paragraph>{totalReviewCount} global ratings</Typography>
      <Divider light />
      <Box sx={{
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Stack spacing={2} sx={{
          flex: 1,
          marginTop: 1,
          maxWidth: '60%',
        }}>
          {[1, 2, 3, 4, 5].map((rating) => {
            return (
              <Box key={rating} sx={{ cursor: 'pointer', width: '100%' }} onClick={() => reloadReviewArea(rating)}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography paragraph>{rating} stars</Typography>
                  <Typography paragraph>{ratingDistribution[rating - 1] || 0}%</Typography>
                </Box>
                <LinearProgress determinate value={ratingDistribution[rating - 1] || 0} />
                <Divider light />
              </Box>
            );
          })}
        </Stack>
      </Box>
      <br/><br/>
      <Typography variant='h5'>Reviews for {targetRating} stars</Typography>
      {listingId && <ReviewArea id={listingId} reviews={targetReview}/>}
    </>
  );
};

export default ReviewPage;
