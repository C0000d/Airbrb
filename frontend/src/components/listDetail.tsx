import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';

import { fetchListingDetails } from './listElement';
import { ListingDetail } from './dashboard';
import { AuthContext } from '../AuthContext';

const ListDetail = () => {
  // get listingId from outer router
  const { listingId } = useParams<{ listingId?: string }>();
  const [listing, setListing] = useState<ListingDetail| null>();
  const [error, setError] = useState<string | null>();

  // display thumbnail
  let thumbnail = 'defaultImg.png';

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

        thumbnail = details.thumbnail;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error!');
        }
      }
    })();
  }, [listingId]);

  const sendComment = () => {
    // check if logged in
    const authContext = useContext(AuthContext);
    // check if authContext works
    if (!authContext) {
      throw new Error('authContext not available!');
    }

    const { token } = authContext;

    if (!token) {
      alert('Please loggin first!');
    }

    // if logged in
  };

  // if error exists
  if (error) {
    return <>Error: {error}</>;
  }
  // if get invalid listing
  if (!listing) {
    return <>Loading...</>;
  }
  return (
    <>
      <img src={listing.thumbnail} alt='listing image'/>
      <Typography variant='h4'>{listing.title}</Typography>
      <Typography variant='h4'>{listing.address}</Typography>
      <Typography variant='subtitle2'>Owned By: {listing.owner}</Typography>

      <TextField
          id="outlined-multiline-static"
          fullWidth
          multiline
          rows={6}
          placeholder="Leave Comment Here..."
        />
      <Button onClick={sendComment}>Send</Button>
    </>
  );
}

export default ListDetail;
