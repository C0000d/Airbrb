import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom';

const HostedListings = () => {
  const location = useLocation();
  const atDetailPage = location.pathname.includes('hostedLIstDetail');

  return (
    <>
      {!atDetailPage && (
        <Link to="hostedLIstDetail">hostedListing</Link>
      )}
      <Outlet />
    </>
  );
}

export default HostedListings;
