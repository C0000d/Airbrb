import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import FileToDataUrl from './fileToDataURL'

const CreateHostedListing = () => {
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [type, setType] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [img, setImg] = React.useState('');

  const navigate = useNavigate();
  const back = () => {
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

  const [fileName, setFileName] = useState('');
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const res = await FileToDataUrl(file);
      setImg(res)
    } else {
      setFileName('');
    }
  };

  // const FileToDataUrl = async (file: File):Promise<string> => {
  //   const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  //   const valid = validFileTypes.find((type) => type === file.type);
  //   // Bad data, let's walk away.
  //   if (!valid) {
  //     throw Error('provided file is not a png, jpg or jpeg image.');
  //   }
  //   const reader = new FileReader();
  //   return new Promise<string>((resolve, reject) => {
  //     reader.onerror = () => reject(reader.error);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.readAsDataURL(file);
  //   });
  // }

  const create = async () => {
    // console.log(img)
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      body: JSON.stringify({
        title, address, price, thumbnail: img, metadata: { type, number, bedrooms, amenities }
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Successfully create a new listing!')
      // navigate('/hostedListing');
    }
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
        <TextField fullWidth label="Listing Title" value={title} onChange={e => setTitle(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Listing Address" value={address} onChange={e => setAddress(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Listing Price (per night)" value={price} onChange={e => setPrice(e.target.value)} /> <br />
        <br />
        {/* <TextField fullWidth label="Listing Thumbnail" /> <br /> */}
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
            Listing Thumbnail: &nbsp;&nbsp;&nbsp;
          </Typography>
          {/* <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
          <VisuallyHiddenInput type="file" accept="image/jpeg, image/png, image/jpg" />
          </Button> */}
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            {fileName || 'Upload file'}
            <VisuallyHiddenInput
              // value={img}
              accept="image/jpeg, image/png, image/jpg"
              type="file"
              onChange={handleFileChange}
              // onChange={e => setImg(e.target.files[0])}
          />
          </Button>
        </Box>
        <br />
        <TextField fullWidth label="Property Type" value={type} onChange={e => setType(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Number of bathrooms" value={number} onChange={e => setNumber(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Property bedrooms" value={bedrooms} onChange={e => setBedrooms(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Property amenities" value={amenities} onChange={e => setAmenities(e.target.value)} /> <br />
        <br />
        <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Cancel</Button>
        <Button variant="contained" type="button" onClick={create} style={{ marginBottom: 10 }}>Submit</Button>
      </Box>
    </>
  );
}

export default CreateHostedListing;
