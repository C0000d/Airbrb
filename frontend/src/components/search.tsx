import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListElement, { getReviewRate } from './listElement';
import { ListingData } from './dashboard';
import { Box, Button, Typography, Grid } from '@mui/material';

const SearchPage = () => {
  let stitle = localStorage.getItem('stitle');
  let scity = localStorage.getItem('scity');
  const sminNum = localStorage.getItem('sminNum');
  const smaxNum = localStorage.getItem('smaxNum');
  const sminPrice = localStorage.getItem('sminPrice');
  const smaxPrice = localStorage.getItem('smaxPrice');
  const order = localStorage.getItem('order');
  const navigate = useNavigate();
  const back = () => {
    navigate('/dashboard');
  }

  // set searching states
  const [searchListing, setSearchListing] = useState<ListingData[]>([]);

  const getDetail = async (id: string) => {
    const response = await fetch(`http://localhost:5005/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      return data;
    }
  }

  // get current location
  const location = useLocation();
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
        // get user input
        let newListings: ListingData[] = [];
        allListing.listings.forEach((listing: ListingData) => {
          if (stitle === null) {
            stitle = '';
          }
          if (scity === null) {
            scity = '';
          }
          if (listing.title.toLowerCase().includes(stitle.toLowerCase()) && listing.address.toLowerCase().includes(scity.toLowerCase())) {
            newListings.push(listing);
          }
          const fetchDetailsAndUpdateListings = async () => {
            if (newListings) {
              const temp = [];
              for (const listing of newListings) {
                try {
                  const detail = await getDetail(listing.id);
                  if (detail.listing.published === true) {
                    temp.push(listing);
                  }
                } catch (error) {
                  console.error(error);
                  alert(error);
                }
              }
              newListings = temp;
            }

            // filter mismatched listings
            if (sminPrice !== null && sminPrice !== '') {
              newListings = newListings.filter(listing => { return listing.price >= parseInt(sminPrice) })
            }
            if (smaxPrice !== null && smaxPrice !== '') {
              newListings = newListings.filter(listing => { return listing.price <= parseInt(smaxPrice) })
            }
            if (order === 'increase') {
              newListings.sort((a, b) => parseFloat(getReviewRate(a.reviews)) - parseFloat(getReviewRate(b.reviews)));
            }
            if (order === 'decrease') {
              newListings.sort((a, b) => parseFloat(getReviewRate(b.reviews)) - parseFloat(getReviewRate(a.reviews)));
            }
            if (sminNum !== null && sminNum !== '') {
              const temp = [];
              for (const listing of newListings) {
                try {
                  const detail = await getDetail(listing.id);
                  if (parseInt(detail.listing.metadata.bedrooms) >= parseInt(sminNum)) {
                    temp.push(listing);
                  }
                } catch (error) {
                  console.error(error);
                  alert(error);
                }
              }
              newListings = temp;
            }

            if (smaxNum !== null && smaxNum !== '') {
              const temp = [];
              for (const listing of newListings) {
                try {
                  const detail = await getDetail(listing.id);
                  if (parseInt(detail.listing.metadata.bedrooms) <= parseInt(smaxNum)) {
                    temp.push(listing);
                  }
                } catch (error) {
                  console.error(error);
                  alert(error);
                }
              }
              newListings = temp;
            }
          };
          const applyFilters = async () => {
            await fetchDetailsAndUpdateListings();
            setSearchListing(newListings);
          };
          applyFilters();
        });
      }
    })();
  }, [location.state]);

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Search Result
      </Typography>
      {searchListing.length !== 0
        ? (
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
                {searchListing.map((listing: ListingData) => (
                  <Grid item key={listing.id} {...{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <div onClick={() => navigate(`/listings/${listing.id}`, { state: { from: 'search' } })}>
                      <ListElement listingId={listing.id} onClick={ () => { console.log() } } />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )
        : (
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
              No result found...
            </Typography>
          )
      }
    </>
  );
};

export default SearchPage;
