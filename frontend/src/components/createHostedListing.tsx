import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const CreateHostedListing = () => {
  return (
    <>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
        }}
      >
        <br />
        <TextField fullWidth label="Listing Title" /> <br />
        <br />
        <TextField fullWidth label="Listing Address" /> <br />
        <br />
        <TextField fullWidth label="Listing Price (per night)" /> <br />
        <br />
        <TextField fullWidth label="Listing Thumbnail" /> <br />
        <br />
        <TextField fullWidth label="Property Type" /> <br />
        <br />
        <TextField fullWidth label="Number of bathrooms" /> <br />
        <br />
        <TextField fullWidth label="Property bedrooms" /> <br />
        <br />
        <TextField fullWidth label="Property amenities" /> <br />
      </Box>
    </>
  );
}

export default CreateHostedListing;
