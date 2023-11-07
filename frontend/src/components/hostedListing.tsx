import React from 'react'
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import HostedDetail from './hostedLIstDetail'
import CreateHostedListing from './createHostedListing';
import Button from '@mui/material/Button';

const HostedListings = () => {
  const location = useLocation();
  const atDetailPage = location.pathname.includes('hostedLIstDetail');
  const atCreateListingPage = location.pathname.includes('createHostedListing');
  const isAtEitherPage = atDetailPage || atCreateListingPage;
  const navigate = useNavigate();
  const createListing = () => {
    navigate('/hostedListing/createHostedListing')
  }

  return (
    <>
      {
        !isAtEitherPage && (
        <>
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
