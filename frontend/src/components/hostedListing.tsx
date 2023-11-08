import React from 'react'
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

  const listingId = '156';

  return (
    <>
      {
        !isAtEitherPage && (
        <>
          <Button variant="contained" type="button" onClick={createListing}>Create Listing</Button>
          <Box sx={{ flexGrow: 1, p: 2 }}>
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
              <Grid>
                <ListingElement listingId={listingId}/>
              </Grid>
                <Grid>
                  <Button variant="contained" type="button" onClick={createListing}>Create Listing</Button>
              </Grid>
              {[...Array(6)].map((_, index) => (
                <Grid key={index} {...{ xs: 12, sm: 6, md: 4, lg: 3 }} minHeight={160} />
              ))}
            </Grid>
          </Box>
          <Link to="./hostedLIstDetail">hostedListing</Link>
          <Button variant="contained" type="button" onClick={createListing}>Create Listing</Button>
        </>
        )
      }
      {/* <Outlet /> */}
      <Routes>
        <Route path='/hostedLIstDetail' element={<HostedDetail />} />
        <Route path='/createHostedListing' element={<CreateHostedListing />} />
      </Routes>
    </>
  );
}

export default HostedListings;
