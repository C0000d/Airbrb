import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileToDataUrl from './fileToDataURL'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const CreateHostedListing = () => {
  // set states
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [beds, setBeds] = useState('');
  const [amenities, setAmenities] = useState('');
  const [img, setImg] = useState('');
  const [video, setVideo] = useState('');
  const [fileName, setFileName] = useState('');

  const navigate = useNavigate();
  const back = () => {
    navigate('/hostedListing');
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
        const response = await FileToDataUrl(file);
        setImg(response);
      } else {
        setFileName('');
      }
    }
  };

  const create = async () => {
    // check if input is valid
    if (title === '') {
      alert('Please input title!');
      return;
    }

    if (address === '') {
      alert('Please input address!');
      return;
    }

    if (price === '') {
      alert('Please input price!');
      return;
    }

    if (type === '') {
      alert('Please input type!');
      return;
    }

    if (bathrooms === '') {
      alert('Please input number of bathrooms!');
      return;
    }

    if (bedrooms === '') {
      alert('Please input number of bedrooms!');
      return;
    }

    if (beds === '') {
      alert('Please input number of beds!');
      return;
    }

    if (amenities === '') {
      alert('Please describe the amenities!');
      return;
    }

    // send request to api
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      body: JSON.stringify({
        title, address, price, thumbnail: img, metadata: { type, bathrooms, bedrooms, beds, amenities, video }
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Successfully create a new listing!');
      navigate('/hostedListing', { state: { from: 'create' } });
    }
  }

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Box sx={{
        width: 500,
        maxWidth: '100%',
        margin: 'auto',
        textAlign: 'center'
      }}>
        <Typography variant="h4" gutterBottom>
          Create a new listing
        </Typography>
        <br />
        <TextField data-cy="create-list-title" fullWidth label="Listing Title *" value={title} onChange={e => setTitle(e.target.value)} /> <br />
        <br />
        <TextField data-cy="create-list-address" fullWidth label="Listing Address *" value={address} onChange={e => setAddress(e.target.value)} /> <br />
        <br />
        <TextField data-cy="create-list-price" fullWidth label="Listing Price (per night) *" value={price} onChange={e => setPrice(e.target.value)} /> <br />
        <br />
        <Box sx={{
          width: 500,
          maxWidth: '100%',
          margin: 'auto',
          textAlign: 'center',
          display: 'flex',
        }}>
          <Typography variant="h6" gutterBottom>
            Thumbnail (optional): &nbsp;&nbsp;
          </Typography>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            {fileName || 'Upload file'}
            <VisuallyHiddenInput
              accept="image/jpeg, image/png, image/jpg"
              type="file"
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        <br />
        <Card sx={{ boxShadow: 0 }}>
          <CardMedia
            component="img"
            height='auto'
            image={img || require('./defaultImg.png')}
            alt="Thumbnail Image"
            sx={{
              width: '50%',
              marginLeft: 'auto',
              marginRight: 'auto',
              height: 'auto'
            }}
          />
        </Card>
        <br />
        <TextField data-cy="create-list-type" fullWidth label="Property Type *" value={type} onChange={e => setType(e.target.value)} /> <br />
        <br />
        <TextField data-cy="create-list-bathrooms" fullWidth label="Number of bathrooms *" value={bathrooms} onChange={e => setBathrooms(e.target.value)} /> <br />
        <br />
        <TextField data-cy="create-list-bedrooms" fullWidth label="Number of bedrooms *" value={bedrooms} onChange={e => setBedrooms(e.target.value)} /> <br />
        <br />
        <TextField data-cy="create-list-beds" fullWidth label="Number of beds *" value={beds} onChange={e => setBeds(e.target.value)} /> <br />
        <br />
        <TextField data-cy="create-list-amenities" fullWidth label="Property amenities *" value={amenities} onChange={e => setAmenities(e.target.value)} /> <br />
        <br />
        <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Cancel</Button>
        <Button data-cy="create-list-Submit" variant="contained" type="button" onClick={create} style={{ marginBottom: 10 }}>Submit</Button>
      </Box>
    </>
  );
}

export default CreateHostedListing;
