import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import ListElement from './listElement';
import { Box, Grid, Typography } from '@mui/material';
import { CircularProgress } from '@mui/joy';

interface Review {
  user: string;
  rate: number;
  comment: string;
  postOn: Date;
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
  beds: string;
  bathrooms: string;
  video: string;
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
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingData[]>([]);
  const [bookings, setBookins] = useState<Booking[]>([]);

  // get token from AuthContext
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

        const publishedListings = [];
        for (const listing of listingData) {
          const detailsResponse = await fetch(`http://localhost:5005/listings/${listing.id}`);
          if (!detailsResponse.ok) {
            // Skip this listing if its details can't be fetched
            console.error(`Failed to fetch listing details for ID ${listing.id}`);
            continue;
          }
          const jsonDetails = await detailsResponse.json();
          if (jsonDetails.listing.published) {
            publishedListings.push(listing);
          }
        }

        if (token) {
          const user = localStorage.getItem('email');

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
            // prioritize bookings of the user whose status is 'accepted' or 'pending'
            const userbooking = bookingData.find(booking =>
              user === booking.owner &&
              booking.listingId.toString() === listing.id.toString() &&
              (booking.status === 'accepted' || booking.status === 'pending')
            );
            return { ...listing, isPrioritized: !!userbooking };
          }).sort((a, b) => {
            // sort if prioritized, otherwise alphabetically
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

  const handleListingClick = (listingId: string) => {
    // navigate to listing detail page
    navigate(`/listings/${listingId}`);
  };

  if (!listings) {
    return (
      <>
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <CircularProgress size="lg" />
          <Typography variant='h6'>Loading...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
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
              <ListElement listingId={listing.id} onClick={handleListingClick}/>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
export { Booking, Review, TimePeriod, ListingData, ListingDetail, DateRange, MetaData };
