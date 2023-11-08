import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';

interface Booking {
  listingId: string;
  status: 'accpeted' | 'pending' | 'declined' | 'not booked'
}

interface listElementProps {
  id: string;
  title: string;
  thumbnail: string;
  reviewRate: number;
  address: string;
}

const Dashboard = () => {
  // const [listings, setListing] = useState<listElementProps[]>([]);
  // const [userBooking, setUserBooking] = useState<Booking[]>([]);

  // const authContext = useContext(AuthContext);
  // const { token, setToken } = authContext;

  return <>dashboard</>;
}

export default Dashboard;
export { listElementProps };
