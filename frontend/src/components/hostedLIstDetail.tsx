import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import FileToDataUrl from './fileToDataURL'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CircularProgress } from '@mui/joy';
import embedVideoUrl from './embedVideo';
import { Review, TimePeriod, ListingDetail } from './dashboard';

const HostedDetail = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate('/hostedListing')
  }

  const listingId = localStorage.getItem('listingId')
  const [detail, setDetail] = useState<ListingDetail | null>(null);
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [type, setType] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('');
  const [beds, setBeds] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [img, setImg] = React.useState('');
  const [video, setVideo] = React.useState('');
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
        setTitle(data.listing.title);
        setAddress(data.listing.address);
        setPrice(data.listing.price);
        setType(data.listing.metadata.type);
        setBathrooms(data.listing.metadata.bathrooms);
        setBedrooms(data.listing.metadata.bedrooms);
        setBeds(data.listing.metadata.beds);
        if (data.listing.metadata.video) {
          setVideo(data.listing.metadata.video);
        }
        setAmenities(data.listing.metadata.amenities);
        setImg(data.listing.thumbnail);
      }
    }
    getDetail();
  }, [listingId]);
  const [fileName, setFileName] = useState('');
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
        const res = await FileToDataUrl(file);
        setImg(res)
      } else {
        setFileName('');
      }
    }
  };
  const saveChange = async () => {
    if (video !== '') {
      if (!video.includes('youtube') && !video.includes('youtu.be')) {
        alert('Not a valid Youtube video Url!');
        return;
      }
    }
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title, address, price, thumbnail: img, metadata: { type, bathrooms, bedrooms, beds, amenities, video }
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
      alert('Successfully update the listing information!')
      navigate('/hostedListing')
    }
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

  if (!detail) {
    return (
      <>
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <CircularProgress size="lg" />
          <Typography variant='h6'>Loading...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Back</Button>
      <Box
        sx={{
          width: '600px',
          maxWidth: '100%',
          margin: 'auto',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Listing Detail
        </Typography>
        <br />
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
        {detail.metadata.video
          ? (
            <Box sx={{ maxWidth: '100%', width: 500, textAlign: 'center', margin: 'auto' }}>
              <Typography variant="button" gutterBottom></Typography>
              <iframe
                width="100%"
                height="300"
                src={embedVideoUrl(detail.metadata.video)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
                allowFullScreen
              >
              </iframe>
            </Box>
            )
          : (
              <></>
            )
        }
        <br />
        <TextField fullWidth label="Video Url(optional)" value={video} onChange={e => setVideo(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Listing Title *" value={title} onChange={e => setTitle(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Listing Address *" value={address} onChange={e => setAddress(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Listing Price (per night) *" value={price} onChange={e => setPrice(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Property Type *" value={type} onChange={e => setType(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Number of bathrooms *" value={bathrooms} onChange={e => setBathrooms(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Number of bedrooms *" value={bedrooms} onChange={e => setBedrooms(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Number of beds *" value={beds} onChange={e => setBeds(e.target.value)} /> <br />
        <br />
        <TextField fullWidth label="Property amenities *" value={amenities} onChange={e => setAmenities(e.target.value)} /> <br />
        <br />
        <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 40, marginBottom: 10 }}>Close</Button>
        <Button variant="contained" type="button" onClick={saveChange} style={{ marginBottom: 10 }}>Save</Button>
      </Box>
    </>
  );
}

export default HostedDetail;
