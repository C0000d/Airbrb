import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardMedia, CardActionArea, CardActions, Box, Typography, Popover } from '@mui/material';
import { CircularProgress } from '@mui/joy';
import { Review, ListingDetail } from './dashboard';
import RatingPopover from './ratingPopover';
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
  const location = useLocation();
  const [data, setData] = useState<ListingDetail | null>();

  // popover control
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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

  // handle popover
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'listingRating' : undefined;

  if (!data?.metadata) {
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
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
                allowFullScreen
              />
              <CardContent sx={{ paddingBottom: '8px' }}>
                <Typography gutterBottom variant='h5'>Title: {title}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Address: {address}&nbsp;&nbsp; |&nbsp;  Type: {data.metadata.type} <br />
                  No. of beds: {data.metadata.beds}<br />
                  No. of bathrooms: {data.metadata.bathrooms} <br />
                </Typography>
                <br/>
              </CardContent>
            </CardActionArea>
            <CardActions
              aria-describedby={id}
              onClick={handleClick}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant='body2'>&#x2605; {reviewsRate} ({data.reviews.length} reviews)</Typography>
            </CardActions>
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
              <RatingPopover id={listingId} reviews={reviews} location={location} />
            </Popover>
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
              </CardContent>
            </CardActionArea>
            <CardActions
              aria-describedby={id}
              onClick={handleClick}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant='body2'>&#x2605; {reviewsRate} ({data.reviews.length} reviews)</Typography>
            </CardActions>
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
              <RatingPopover id={listingId} reviews={reviews} location={location} />
            </Popover>
          </Card>
          )
      }
    </>
  );
};

export default ListElement;
export { fetchListingDetails, getReviewRate };
