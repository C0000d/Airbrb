import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material';

import { Review, TimePeriod, ListingDetail } from './dashboard';

interface rawListingData {
  listing: ListingDetail;
}

const defaultImg = './defaultImg.png';

const fetchListingDetails = async (listingId?: string) => {
  // get listing detail data from backend
  const response = await fetch(`http://localhost:5005/listings/${listingId}`);

  if (!response.status) {
    throw new Error(`Error: ${response.status}`);
  }

  const data: rawListingData = await response.json();
  return data;
};

const getReviewRate = (reviews: Review[]) => {
  if (reviews.length === 0) {
    return 0;
  }

  const sumRate = reviews.reduce((acc, review) => acc + review.rate, 0);
  return (sumRate / reviews.length).toFixed(2);
};

const ListElement = ({ listingId }: { listingId: string }) => {
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
    return <>Loading...</>
  }

  const title: string = data.title;
  const thumbnail: string = data.thumbnail;
  const address: string = data.address;
  const reviews: Review[] = data.reviews;

  // count average review rate
  const reviewsRate = getReviewRate(reviews);

  return (
    thumbnail
      ? (
          thumbnail.includes('image')
            ? (
              <Card sx={{ maxWidth: '100%', margin: 0.8 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={thumbnail || require('./defaultImg.png')}
                    alt={title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5'>{title}</Typography>
                    <Typography variant='body2' color='text.secondary'>{address}</Typography>
                    <br/>
                    <Typography variant='body2'>&#x2605; {reviewsRate}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              )
            : (
              <Card sx={{ maxWidth: '100%', margin: 0.8 }}>
                <CardActionArea>
                  <CardMedia
                    component="iframe"
                    height="140"
                    src={thumbnail}
                    title={title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5'>{title}</Typography>
                    <Typography variant='body2' color='text.secondary'>{address}</Typography>
                    <br/>
                    <Typography variant='body2'>&#x2605; {reviewsRate}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              )
        )
      : (
        <Card sx={{ maxWidth: '100%', margin: 0.8 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={require('./defaultImg.png')}
                alt={title}
              />
              <CardContent>
                <Typography gutterBottom variant='h5'>{title}</Typography>
                <Typography variant='body2' color='text.secondary'>{address}</Typography>
                <br/>
                <Typography variant='body2'>&#x2605; {reviewsRate}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )
  );
};

export default ListElement;
export { fetchListingDetails };
