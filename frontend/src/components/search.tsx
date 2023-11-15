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

interface Review {
  user: string;
  rate: number;
  comment: string;
  postOn: Date;
}

interface MetaData {
  type: string;
  number: string;
  bedrooms: string;
  amenities: string;
  beds: string;
  bathrooms: string
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

const SearchPage = () => {
  let stitle = localStorage.getItem('stitle');
  let scity = localStorage.getItem('scity');
  const sminNum = localStorage.getItem('sminNum');
  const smaxNum = localStorage.getItem('smaxNum');
  const sminPrice = localStorage.getItem('sminPrice');
  const smaxPrice = localStorage.getItem('smaxPrice');
  const navigate = useNavigate();
  const back = () => {
    navigate('/dashboard')
  }

  const getDetail = async (id: string) => {
    const res = await fetch(`http://localhost:5005/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      return data;
    }
  }

  const [searchListing, setSearchListing] = useState<Listing[]>([])
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
        let newListings: Listing[] = [];
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
          if (sminPrice !== null && sminPrice !== '') {
            newListings = newListings.filter(listing => { return listing.price >= parseInt(sminPrice) })
          }
          if (smaxPrice !== null && smaxPrice !== '') {
            newListings = newListings.filter(listing => { return listing.price <= parseInt(smaxPrice) })
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
              newListings = temp
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
              newListings = temp
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
              newListings = temp
            }
            // if (smaxNum !== null && smaxNum !== '') {
            //   const temp = [];
            //   for (const listing of newListings) {
            //     try {
            //       const detail = await getDetail(listing.id);
            //       if (parseInt(detail.listing.metadata.bedrooms) <= parseInt(smaxNum)) {
            //         temp.push(listing);
            //       }
            //     } catch (error) {
            //       console.error(error);
            //       alert(error);
            //     }
            //   }
            //   newListings = temp
            // }
          };
          const applyFilters = async () => {
            await fetchDetailsAndUpdateListings();
            setSearchListing(newListings);
          };
          applyFilters();
        });
      }
    })();
  }, [])

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
          )
        : (
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            No result found...
          </Typography>
          )
    }
    </>
  )
}

export default SearchPage;
