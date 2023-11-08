import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

import { fetchListingDetails } from './listElement';

// define the types for the address
interface Address {
  // define Availability format
}

interface Metadata {
  // define Availability format
}

interface Review {
  // define Availability format
}
interface TimePeriod {
  // define Availability format
  start: string;
  end: string;
}

interface ListingDetail {
  title: string;
  owner: string;
  address: Address;
  price: number;
  thumbnail: string;
  metadata: Metadata;
  reviews: Review[];
  availability: TimePeriod[];
  published: boolean;
  postedOn: string;
}

const ListDetail = () => {
  // get listingId from outer router
  const { listingId } = useParams<{ listingId?: string }>();
  const [listing, setListing] = useState<ListingDetail| null>();
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    // check if listingId is defined
    if (!listingId) {
      alert('Invalid listingId!');
    }

    (async () => {
      try {
        const details = await fetchListingDetails(listingId);
        setListing(details);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        else {
          setError('Unknown error!');
        }
      }
    })();
  }, [listingId]);

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
      <Typography variant='subtitle2'>Owned By: {listing.owner}</Typography>
    </>
  );
}

export default ListDetail;