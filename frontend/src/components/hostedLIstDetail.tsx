import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const HostedDetail = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate('/hostedListing')
  }

  const listingId = localStorage.getItem('listingId')
  const [detail, setDetail] = useState({ title: '', thumbnail: '', address: '', metadata: { type: '', beds: '', bedrooms: '', amenities: '', bathrooms: '' }, price: '', reviews: [], published: false });
  useEffect(() => {
    const getDetail = async () => {
      const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setDetail(data.listing);
        // const [title, setTitle] = React.useState(detail.title);
        // console.log(detail.published)
      }
    }
    getDetail()
  }, []);

  const [title, setTitle] = React.useState(detail.title);
  // console.log(title)
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [type, setType] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('');
  const [beds, setBeds] = React.useState('');
  const [amenities, setAmenities] = React.useState('');

  const saveChange = () => {
    alert('Successfully update the listing information!')
    navigate('/hostedListing')
  }
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

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
          Listing Detail
        </Typography>
        {/* <br /> */}
        <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          margin: 'auto',
          textAlign: 'center',
          display: 'flex',
        }}
        >
          <Typography variant="h6" gutterBottom>
            Thumbnail: &nbsp;&nbsp;
          </Typography>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            {'Upload file'}
            <VisuallyHiddenInput
              accept="image/jpeg, image/png, image/jpg"
              type="file"
          />
          </Button>
        </Box>
        <br />
        <TextField fullWidth label="Listing Title *" value={detail.title} /> <br />
        <br />
        <TextField fullWidth label="Listing Address *" value={detail.address} /> <br />
        <br />
        <TextField fullWidth label="Listing Price (per night) *" value={detail.price} /> <br />
        <br />
        <TextField fullWidth label="Property Type *" value={detail.metadata.type} /> <br />
        <br />
        <TextField fullWidth label="Number of bathrooms *" value={detail.metadata.bathrooms} /> <br />
        <br />
        <TextField fullWidth label="Number of bedrooms *" value={detail.metadata.bedrooms} /> <br />
        <br />
        <TextField fullWidth label="Number of beds *" value={detail.metadata.beds} /> <br />
        <br />
        <TextField fullWidth label="Property amenities *" value={detail.metadata.amenities} /> <br />
        <br />
        <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Close</Button>
        <Button variant="contained" type="button" onClick={saveChange} style={{ marginBottom: 10 }}>Save</Button>
      </Box>
    </>
  );
}

export default HostedDetail;
