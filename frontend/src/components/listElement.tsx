import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material';

import { listElementProps } from './dashboard';

const fetchListingDetails = async (listingId?: string) => {
  // get listing detail data from backend
  const response = await fetch(`http://localhost:5005/listings/${listingId}`);

  if (!response.status) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = response.json();
  return data;
};

const ListElement = ({ title, thumbnail, address, reviewRate }: listElementProps) => {
  return (
    thumbnail.includes('image') ? (
      <Card sx={{maxWidth: 300}}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={thumbnail}
            alt={title}
          />
          <CardContent>
            <Typography gutterBottom variant='h5'>{title}</Typography>
            <Typography variant='body2' color='text.secondary'>{address}</Typography>
            <br/>
            <Typography variant='body2'>&#x2605 {reviewRate}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    ) : (
      <Card sx={{maxWidth: 300}}>
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
            <Typography variant='body2'>&#x2605 {reviewRate}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
    
  );
}

export default ListElement;
export { fetchListingDetails };