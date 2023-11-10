import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import ListElement, { fetchListingDetails } from './listElement';
import { Box, Grid } from '@mui/material';

interface Review {
  user: string;
  rate: number;
  comment: string;
}

interface ListingData {
  id: string;
  title: string;
  owner: string;
  address: string;
  thumbnail: string;
  price: number;
  reviews: Review[];
}

interface Booking {
  listingId: string;
  startDate: string;
  endDate: string;
  status: 'accpeted' | 'pending' | 'not booked';
}

interface MetaData {
  type: string;
  number: string;
  bedrooms: string;
  amenities: string;
}

interface TimePeriod {
  // define Availability format
  start: string;
  end: string;
}

interface ListingDetail {
  title: string;
  owner: string;
  address: string;
  price: number;
  thumbnail: string;
  metadata: MetaData;
  reviews: Review[];
  availability: TimePeriod[];
  published: boolean;
  postedOn: string;
}

const Dashboard = () => {
  const [listings, setListings] = useState<ListingData[]>([]);

  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }

  const { token } = authContext;

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:5005/listings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonResponse = await response.json();
        const listingData: ListingData[] = jsonResponse.listings;
        // console.log(listingData);
        setListings(listingData);
        // const bookingData: Booking[] = [];
        // if (token) {
        //   bookingData = await fetch('http://localhost:5005/bookings');
        //   setUserBooking(bookingData);
        // }
      } catch (error) {
        alert(`Error: Failed to fetch listings, ${error}`);
      }
    })();
  }, []);

  if (!listings) {
    return <>Loading...</>
  }

  // listings.map((listing) => (console.log(listing.reviews)));

  return token
    ? (
      <>
        dashboard
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

            {listings.map((listing, index) => (
              <Grid item key={index} {...{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Link key={listing.id} to={`/listings/${listing.id}`}>
                  <ListElement listingId={listing.id} />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>

      </>
      )
    : (
      <>landing page</>
      );
};

// const compare = (a: string, b: string) => {
//   if ()
//   return
// };

export default Dashboard;
export { Booking, Review, TimePeriod, ListingData, ListingDetail };
