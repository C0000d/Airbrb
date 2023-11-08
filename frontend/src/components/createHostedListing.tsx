import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const CreateHostedListing = () => {
  const [title, settitle] = React.useState('');
  const [address, setaddress] = React.useState('');
  const [price, setprice] = React.useState('');

  const navigate = useNavigate();
  const back = () => {
    navigate('/hostedListing')
  }

  return (
    <>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          margin: 'auto',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create a new listing
        </Typography>
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
        <br />
        <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Cancel</Button>
        <Button variant="contained" type="button" style={{ marginBottom: 10 }}>Register</Button>
      </Box>
    </>
  );
}

export default CreateHostedListing;
