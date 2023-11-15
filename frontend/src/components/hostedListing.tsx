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
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import RevenueGraph from './RevenueGraph';

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
  }, [location.state])

  const listingId = localStorage.getItem('listingId')

  const revenue = [{ day: '0', revenue: '1000' }, { day: '1', revenue: '1500' }, { day: '2', revenue: '1020' }, { day: '3', revenue: '540' }, { day: '4', revenue: '1250' }, { day: '4', revenue: '2150' }, { day: '6', revenue: '1050' }, { day: '7', revenue: '950' }, { day: '8', revenue: '4250' }, { day: '9', revenue: '2501' }, { day: '10', revenue: '7527' }, { day: '11', revenue: '447' }, { day: '12', revenue: '2752' }, { day: '13', revenue: '4527' }, { day: '14', revenue: '2725' }, { day: '15', revenue: '7527' }, { day: '16', revenue: '7527' }, { day: '17', revenue: '7527' }, { day: '18', revenue: '4527' }, { day: '19', revenue: '7542' }, { day: '20', revenue: '7274' }, { day: '21', revenue: '7527' }, { day: '22', revenue: '7527' }, { day: '23', revenue: '2047' }, { day: '24', revenue: '7425' }, { day: '25', revenue: '2475' }, { day: '26', revenue: '7427' }, { day: '27', revenue: '7475' }, { day: '28', revenue: '7425' }, { day: '29', revenue: '5727' }, { day: '30', revenue: '2574' }]

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
            <Box sx={{ maxWidth: '100%', width: 500, textAlign: 'center', margin: 'auto' }}>
              <RevenueGraph revenueData={revenue} />
            </Box>
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
