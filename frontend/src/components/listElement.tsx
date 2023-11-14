import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, CardActionArea, Box, Typography } from '@mui/material';
import { CircularProgress } from '@mui/joy';
import { Review, TimePeriod, ListingDetail } from './dashboard';
import embedVideoUrl from './embedVideo';

interface rawListingData {
  listing: ListingDetail;
}

const fetchListingDetails = async (listingId?: string) => {
  // get listing detail data from backend
  const response = await fetch(`http://localhost:5005/listings/${listingId}`);

  if (!response.status) {
    throw new Error(`Error: ${response.status}`);
  }

  const data: rawListingData = await response.json();
  // console.log(data)
  return data;
};

const getReviewRate = (reviews: Review[]) => {
  if (reviews.length === 0) {
    return '0';
  }

  const sumRate = reviews.reduce((acc, review) => acc + review.rate, 0);
  return (sumRate / reviews.length).toFixed(2);
};

const ListElement = ({ listingId, onClick }: { listingId: string, onClick: (listingId: string) => void }) => {
  const [data, setData] = useState<ListingDetail | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await fetchListingDetails(listingId);
        const data: ListingDetail = jsonData.listing;
        setData(data);
      } catch (error) {
        alert(`Error: can't get listing detail: ${error}`);
      }
    };

    fetchData();
  }, [listingId]);

  if (!data) {
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
          <CircularProgress size="sm" />
          <Typography variant='h6'>Loading...</Typography>
        </Box>
      </>
    );
  }

  const title: string = data.title;
  const thumbnail: string = data.thumbnail;
  const address: string = data.address;
  const reviews: Review[] = data.reviews;
  const video: string = data.metadata.video;

  // count average review rate
  const reviewsRate = getReviewRate(reviews);

  return (
    <>
      {video
        ? (
          <Card sx={{ maxWidth: '100%', boxShadow: 0, paddingRight: '16px' }}>
            <CardActionArea onClick={() => onClick(listingId)}>
              <CardMedia
                component="iframe"
                height="270"
                src={embedVideoUrl(video)}
                title={title}
              />
              <CardContent sx={{ paddingBottom: '8px' }}>
                <Typography gutterBottom variant='h5'>Title: {title}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Address: {address}&nbsp;&nbsp; |&nbsp;  Type: {data.metadata.type} <br />
                  No. of beds: {data.metadata.beds}<br />
                  No. of bathrooms: {data.metadata.bathrooms} <br />
                </Typography>
                <br/>
                <Typography variant='body2'>&#x2605; {reviewsRate} ({data.reviews.length} reviews)</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          )
        : (
          <Card sx={{ maxWidth: '100%', boxShadow: 0, paddingRight: '16px' }}>
            <CardActionArea onClick={() => onClick(listingId)}>
              <CardMedia
                component="img"
                height="auto"
                image={thumbnail || require('./defaultImg.png')}
                alt={title}
              />
              <CardContent sx={{ paddingBottom: '8px' }}>
                <Typography gutterBottom variant='h5'>Title: {title}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Address: {address}&nbsp;&nbsp; |&nbsp;  Type: {data.metadata.type} <br />
                  No. of beds: {data.metadata.beds}<br />
                  No. of bathrooms: {data.metadata.bathrooms} <br />
                </Typography>
                <br/>
                <Typography variant='body2'>&#x2605; {reviewsRate} ({data.reviews.length} reviews)</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          )
      }
    </>
  );
};

export default ListElement;
export { fetchListingDetails, getReviewRate };
