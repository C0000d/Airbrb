import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import HostedDetail from './hostedLIstDetail'
import CreateHostedListing from './createHostedListing';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import ListingElement from './hostedLIstElement'

const HostedListings = () => {
  const location = useLocation();
  const atDetailPage = location.pathname.includes('hostedLIstDetail');
  const atCreateListingPage = location.pathname.includes('createHostedListing');
  const isAtEitherPage = atDetailPage || atCreateListingPage;
  const navigate = useNavigate();
  const createListing = () => {
    navigate('/hostedListing/createHostedListing')
  }
  const [hostedListings, setHostedListings] = useState<any[]>([]);
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
        const newListings: any = []
        allListing.listings.forEach((listing: any) => {
          if (listing.owner === user) {
            newListings.push(listing);
          }
        });
        setHostedListings(newListings);
      }
    })();
  }, [])

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
                {hostedListings.map((listing: any) => (
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
        <Route path='/hostedLIstDetail' element={<HostedDetail />} />
        <Route path='/createHostedListing' element={<CreateHostedListing />} />
      </Routes>
    </>
  );
}

export default HostedListings;
