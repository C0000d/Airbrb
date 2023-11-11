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

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface Booking {
  id: string;
  owner: string;
  dateRange: DateRange;
  listingId: string;
  totalPrice: number;
  status: string;
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
  const [bookings, setBookins] = useState<Booking[]>([]);
  // add a property to check if the listing is published to show on dashboard

  const authContext = useContext(AuthContext);
  // check if authContext works
  if (!authContext) {
    throw new Error('authContext not available!');
  }

  const { token } = authContext;

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch('http://localhost:5005/listings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonResponse = await response.json();
        const listingData: ListingData[] = jsonResponse.listings;
        // console.log(listingData);

        const publishedListings = [];
        for (const listing of listingData) {
          const detailsResponse = await fetch(`http://localhost:5005/listings/${listing.id}`);
          if (!detailsResponse.ok) {
            console.error(`Failed to fetch listing details for ID ${listing.id}`);
            continue; // Skip this listing if the details can't be fetched
          }
          const jsonDetails = await detailsResponse.json();
          if (jsonDetails.listing.published) {
            publishedListings.push(listing);
          }
        }

        if (token) {
          const user = localStorage.getItem('email');
          console.log('user: ', user);
          // fetch bookings
          response = await fetch('http://localhost:5005/bookings', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const jsonResponse = await response.json();
          const bookingData: Booking[] = jsonResponse.bookings;
          setBookins(bookingData);

          const sortedListings = publishedListings.map(listing => {
            // check if there is a booking by this user with 'accepted' or 'pending'
            const userbooking = bookingData.find(booking =>
              user === booking.owner &&
              booking.listingId.toString() === listing.id.toString() &&
              (booking.status === 'accepted' || booking.status === 'pending')
            );
            return { ...listing, isPrioritized: !!userbooking };
          }).sort((a, b) => {
            if (a.isPrioritized !== b.isPrioritized) {
              return a.isPrioritized ? -1 : 1;
            }
            return a.title.localeCompare(b.title);
          });

          setListings(sortedListings);
        } else {
          // set listing with publishedListings
          setListings(publishedListings.sort((a, b) => a.title.localeCompare(b.title)));
        }
      } catch (error) {
        alert(`Error: Failed to fetch listings, ${error}`);
      }
    })();
  }, [token]);

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
      <>
        landing page
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
      );
};

// const compare = (a: string, b: string) => {
//   if ()
//   return
// };

export default Dashboard;
export { Booking, Review, TimePeriod, ListingData, ListingDetail, DateRange };
