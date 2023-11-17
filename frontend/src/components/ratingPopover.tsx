import React, { useEffect } from 'react';
import { Location, useNavigate } from 'react-router-dom';
import { Review } from './dashboard';
import { getReviewRate } from './listElement';
import { Box, Rating, Typography, Card, Divider, Stack } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';

interface RatingPopoverProps {
  id: string | undefined;
  reviews: Review[];
  location?: Location;
}

interface reviewClassification {
  1: Review[];
  2: Review[];
  3: Review[];
  4: Review[];
  5: Review[];
}

const classifyReviews = (reviews: Review[]) => {
  const classifiedReview: reviewClassification = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  reviews.forEach(review => {
    const rate = review.rate as keyof reviewClassification;
    classifiedReview[rate].push(review);
  });

  return classifiedReview;
};

const RatingPopover = ({ reviews, id, location }: RatingPopoverProps) => {
  const listingId: string | undefined = id;
  const navigate = useNavigate();
  const totalRate = +getReviewRate(reviews); // convert string to number
  const totalReviewCount = reviews.length;
  const classifiedReview: reviewClassification = classifyReviews(reviews);
  const ratingDistribution: number[] = [];

  useEffect(() => {
    if (!listingId) {
      alert('Invalid listingId! Please try again.');
      navigate('/dashboard');
    }
  }, [listingId]);

  [1, 2, 3, 4, 5].forEach((rating) => {
    ratingDistribution.push(Math.round(classifiedReview[rating as keyof reviewClassification].length * 100 / totalReviewCount))
  });

  const handleRatingClick = (rating: number) => {
    navigate(`/reviewPage/${listingId}`, { state: { from: location?.pathname || '', rating, reviews, listingId } });
  };

  return (
    <>
      <Card sx={{ padding: 2 }}>
        <Box sx={{
          display: 'flex',
          marginBottom: 1,
          justifyContent: 'center',
        }}>
          <Rating data-testid="custom-rating" value={totalRate} precision={0.1} size='large' readOnly />
          <Typography variant='h6'>{totalRate} out of 5</Typography>
        </Box>
        <Typography paragraph>{totalReviewCount} global ratings</Typography>
        <Divider light />
        <Stack spacing={2} sx={{
          flex: 1,
          marginTop: 1,
        }}>
          {[1, 2, 3, 4, 5].map((rating) => {
            return (
              <Box key={rating} sx={{ cursor: 'pointer' }} onClick={ () => handleRatingClick(rating) }>
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
      </Card>
    </>
  );
};

export default RatingPopover;
export { reviewClassification, classifyReviews };
