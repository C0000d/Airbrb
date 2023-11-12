import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography, Rating } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const BookRequest = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate('/hostedListing')
  }
  const listingId = localStorage.getItem('listingId');
  const token = localStorage.getItem('token');
  // const [info, setInfo] = useState([]);
  let info = []

  useEffect(() => {
    const getAllRequest = async () => {
      const res = await fetch('http://localhost:5005/bookings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        info = data.bookings.filter((booking: any) => Number(booking.listingId) === Number(listingId));
        console.log(info)
      }
    }
    getAllRequest();
  }, []);

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      booking request
    </>
  )
}

export default BookRequest;
