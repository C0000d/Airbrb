import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import HostedDetail from './hostedLIstDetail'
import CreateHostedListing from './createHostedListing';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import ListingElement from './hostedLIstElement'

interface Listing {
  // 添加你的listing对象的类型定义
  id: string;
  // 其他的属性...
}

let listings: any = []
let hostedListings: any = []
// const [hostedListings, setHostedListings] = useState<Listing[]>([]);
export const getAllListings = async () => {
  // console.log('hello')
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
    listings = allListing
    // console.log(listings)
    const user = localStorage.getItem('email')
    hostedListings = []
    // const newHostedListings: Listing[] = [];
    listings.listings.forEach((listing: any) => {
      if (listing.owner === user) {
        hostedListings.push(listing);
        // newHostedListings.push(listing);
      }
    });
    console.log(hostedListings)
    // setHostedListings(newHostedListings);
  }
}

export const HostedListings = () => {
  const location = useLocation();
  const atDetailPage = location.pathname.includes('hostedLIstDetail');
  const atCreateListingPage = location.pathname.includes('createHostedListing');
  const isAtEitherPage = atDetailPage || atCreateListingPage;
  const navigate = useNavigate();
  const createListing = () => {
    navigate('/hostedListing/createHostedListing')
  }

  const createElement = () => {
    const elements = [];
    for (const listing of hostedListings) {
      elements.push(
        <Grid key={listing.id} {...{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ListingElement listingId={listing.id} />
        </Grid>
      );
    }
    return elements;
  }

  // useEffect(() => {
  //   getAllListings();
  // }, []);

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
                {createElement()}
              {/* <Grid {...{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ListingElement listingId={listingId}/>
              </Grid> */}
                {/* <Grid>
                  <Button variant="contained" type="button" onClick={createListing}>Create Listing</Button>
              </Grid> */}
              {/* {[...Array(6)].map((_, index) => (
                <Grid key={index} {...{ xs: 12, sm: 6, md: 4, lg: 3 }} minHeight={160} />
              ))} */}
            </Grid>
          </Box>
          {/* <Link to="./hostedLIstDetail">hostedListing</Link> */}
          {/* <Button variant="contained" type="button" onClick={createListing}>Create Listing</Button> */}
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
