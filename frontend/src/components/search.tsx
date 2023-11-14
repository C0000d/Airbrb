import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Rating, Grid } from '@mui/material';
// import ListingElement from './hostedLIstElement';
import ListElement from './listElement';

interface Listing {
  id: string;
  title: string;
  owner: string;
  address: string;
  thumbnail: string;
  price: number;
}

const SearchPage = () => {
  const location = useLocation();
  const { stitle, scity } = location.state || {};
  if (location.state?.from === 'searchfilter') {
    localStorage.setItem('stitle', stitle)
    localStorage.setItem('scity', scity)
  }
  const navigate = useNavigate();
  const back = () => {
    navigate('/dashboard')
  }
  const [searchListing, setSearchListing] = useState<Listing[]>([])
  useEffect(() => {
    if (location.state?.from === 'searchfilter') {
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
          const newListings: Listing[] = [];
          allListing.listings.forEach((listing: Listing) => {
            if (listing.title.toLowerCase().includes(stitle.toLowerCase()) && listing.address.toLowerCase().includes(scity.toLowerCase())) {
              newListings.push(listing);
            }
          });
          setSearchListing(newListings);
        }
      })();
    } else {
      let stitle = localStorage.getItem('stitle');
      let scity = localStorage.getItem('scity');
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
          const newListings: Listing[] = [];
          allListing.listings.forEach((listing: Listing) => {
            if (stitle === null) {
              stitle = ''
            }
            if (scity === null) {
              scity = ''
            }
            if (listing.title.toLowerCase().includes(stitle.toLowerCase()) && listing.address.toLowerCase().includes(scity.toLowerCase())) {
              newListings.push(listing);
            }
          });
          setSearchListing(newListings);
        }
      })();
    }
  }, [location.state])

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      search page <br />
      searchTitle: {stitle} <br />
      City: {scity}
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
            {searchListing.map((listing: Listing) => (
          <Grid item key={listing.id} {...{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <div onClick={() => navigate(`/listings/${listing.id}`, { state: { from: 'search' } })}>
            {/* <Link key={listing.id} to={ `/listings/${listing.id}` }> */}
                  <ListElement listingId={listing.id} onClick={ () => { console.log() } } />
            {/* </Link> */}
            </div>
          </Grid>
            ))}
        </Grid>
      </Box>
    </>
  )
}

export default SearchPage;
