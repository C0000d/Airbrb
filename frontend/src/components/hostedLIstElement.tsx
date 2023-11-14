import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea, CardActions } from '@mui/material';
import { CircularProgress } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import embedVideoUrl from './embedVideo';
import { Review, TimePeriod, ListingDetail } from './dashboard';

interface eleProps {
  listingId: string;
}

const ListingElement = (props: eleProps) => {
  const navigate = useNavigate();
  const detailPage = () => {
    navigate(`/hostedListing/detail/:${props.listingId}`)
  }

  const requestPage = () => {
    navigate(`/hostedListing/bookRequest/:${props.listingId}`)
  }

  const storeId = () => {
    localStorage.setItem('listingId', props.listingId)
  }

  const [detail, setDetail] = useState<ListingDetail | null>(null);
  useEffect(() => {
    const getDetail = async () => {
      const res = await fetch(`http://localhost:5005/listings/${props.listingId}`, {
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
      }
    }

    getDetail()
  }, [props.listingId]);

  const deleteListing = async () => {
    const token = localStorage.getItem('token')
    const listingId = props.listingId
    const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/hostedListing')
      alert('Successfully delete!');
    }
  }

  const publish = () => {
    navigate('/hostedListing/publishListing')
  }

  const unpublish = async () => {
    const token = localStorage.getItem('token')
    const listingId = props.listingId
    const res = await fetch(`http://localhost:5005/listings/unpublish/${listingId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('successfully unpublished!');
      navigate('/hostedListing');
    }
  }

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
        <CircularProgress size="sm" />
        <Typography variant='h6'>Loading...</Typography>
      </Box>
    </>
    );
  }

  return (
    <Card sx={{ maxWidth: '100%', boxShadow: 0 }} onClick={storeId}>
      <CardActionArea onClick={detailPage} sx={{ marginBottom: '8px' }}>
        {detail.metadata.video
          ? (
            <CardMedia
              component="iframe"
              height="270"
              src={embedVideoUrl(detail.metadata.video)}
              title={detail.title}
            />
            )
          : (
              <CardMedia
                component="img"
                height="auto"
                image={detail.thumbnail || require('./defaultImg.png')}
                alt="Thumbnail Image"
              />
            )
        }
        <CardContent sx={{ paddingBottom: '8px' }}>
          <Typography gutterBottom variant="h5" component="div">
            Title: {detail.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Property Type: {detail.metadata.type}
            &nbsp;&nbsp; | No. of beds: {detail.metadata.beds}<br />
            No. of bathrooms: {detail.metadata.bathrooms} <br />
            Price(per night): {detail.price}<br />
            Rating: <br />
            No. of total reviews: {detail.reviews.length}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ paddingTop: '0px' }}>
        <Box>
          <Button style={{ marginRight: '15px' }} size="small" color="primary" onClick={detailPage}>
            Edit
          </Button> &nbsp;
        {!detail.published
          ? (
            <>
              <Button size="small" color="primary" onClick={publish}>
                Publish
              </Button>
            </>
            )
          : (
            <>
              <Button size="small" color="primary" onClick={unpublish}>
                unPublish
              </Button>
            </>
            )
        } &nbsp;
          <br />
          <Button style={{ marginRight: '15px' }} size="small" color="primary" onClick={requestPage}>
            Request
          </Button>
          <Button size="small" color="primary" onClick={deleteListing}>
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

export default ListingElement;
