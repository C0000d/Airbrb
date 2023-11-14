import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HostedDetail from './hostedLIstDetail'
import CreateHostedListing from './createHostedListing';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import ListingElement from './hostedLIstElement';
import Publish from './publishListing';
import BookRequest from './bookingRequest'
import { AuthContext } from '../AuthContext';

interface Listing {
  id: string;
  title: string;
  owner: string;
  address: string;
  thumbnail: string;
  price: number;
}

const HostedListings = () => {
  const location = useLocation();
  const atDetailPage = location.pathname.includes('detail/:');
  const atCreateListingPage = location.pathname.includes('createHostedListing');
  const atPublishListingPage = location.pathname.includes('publishListing');
  const atRequestPage = location.pathname.includes('Request');
  const isAtEitherPage = atDetailPage || atCreateListingPage || atPublishListingPage || atRequestPage;
  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  const createListing = () => {
    navigate('/hostedListing/createHostedListing')
  }
  // const [hostedListings, setHostedListings] = useState<any[]>([]);
  const [hostedListings, setHostedListings] = useState<Listing[]>([])
  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:5005/listings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });
      const allListing = await response.json();
      if (allListing.error) {
        alert(allListing.error);
      } else {
        const user = localStorage.getItem('email')
        // const newListings: any = []
        const newListings: Listing[] = [];
        allListing.listings.forEach((listing: Listing) => {
          if (listing.owner === user) {
            newListings.push(listing);
          }
        });
        setHostedListings(newListings);
      }
    })();
  }, [])

  const listingId = localStorage.getItem('listingId')
  return (
    <>
      {
        !isAtEitherPage && (
        <>
          <Button variant="contained" type="button" onClick={createListing}>Create Listing</Button>
          <Box sx={{ flexGrow: 1, p: 2 }} >
            <Grid
              container
              spacing={2}
              sx={{
                '--Grid-borderWidth': '1px',
                borderTop: 'var(--Grid-borderWidth) solid',
                borderLeft: 'var(--Grid-borderWidth) solid',
                borderColor: 'divider',
                '& > div': {
                  borderRight: 'var(--Grid-borderWidth) solid',
                  borderBottom: 'var(--Grid-borderWidth) solid',
                  borderColor: 'divider',
                },
              }}
              >
                {hostedListings.map((listing: Listing) => (
              <Grid key={listing.id} {...{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ListingElement listingId={listing.id} />
              </Grid>
                ))}
            </Grid>
          </Box>
        </>
        )
      }
      <Routes>
        <Route path={`/detail/:${listingId}`} element={<HostedDetail key={new Date().toISOString()}/>} />
        <Route path='/createHostedListing' element={<CreateHostedListing />} />
        <Route path='/publishListing' element={<Publish />} />
        <Route path={`/bookRequest/:${listingId}`} element={<BookRequest key={new Date().toISOString()}/>} />
      </Routes>
    </>
  );
}

export default HostedListings;
