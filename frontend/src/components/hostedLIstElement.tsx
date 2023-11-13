import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
interface eleProps {
  listingId: string;
}

const ListingElement = (props: eleProps) => {
  const navigate = useNavigate();
  const detailPage = () => {
    // navigate('/hostedListing/hostedLIstDetail')
    navigate(`/hostedListing/detail/:${props.listingId}`)
  }

  const requestPage = () => {
    navigate(`/hostedListing/bookRequest/:${props.listingId}`)
  }

  const storeId = () => {
    localStorage.setItem('listingId', props.listingId)
  }

  const [detail, setDetail] = useState({ title: '', thumbnail: '', address: '', metadata: { type: '', beds: '', bedrooms: '', amenities: '', bathrooms: '' }, price: '', reviews: [], published: false });
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
        // console.log(detail.published)
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

  return (
    <Card sx={{ maxWidth: '100%', boxShadow: 0 }} onClick={storeId}>
      <CardActionArea onClick={detailPage} sx={{ marginBottom: '8px' }}>
        <CardMedia
          component="img"
          height="auto"
          image={detail.thumbnail || require('./defaultImg.png')}
          alt="Thumbnail Image"
        />
        <CardContent sx={{ paddingBottom: '8px' }}>
          <Typography gutterBottom variant="h5" component="div">
            Title: {detail.title}
          </Typography>
          {/* <Button variant="contained" size="small" color="primary" onClick={requestPage}>
            Request
          </Button> <br />
          <br /> */}
          <Typography variant="body2" color="text.secondary">
            {/* Address: {detail.address} <br /> */}
            Property Type: {detail.metadata.type}
            &nbsp;&nbsp; | No. of beds: {detail.metadata.beds}<br />
            {/* No. of bedrooms: {detail.metadata.bedrooms}<br /> */}
            No. of bathrooms: {detail.metadata.bathrooms} <br />
            Price(per night): {detail.price}<br />
            {/* Amenities: {detail.metadata.amenities} <br /> */}
            Rating: <br />
            No. of total reviews: {detail.reviews.length}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ paddingTop: '0px' }}>
        <div>
          <Button style={{ marginBottom: '8px' }} variant="contained" size="small" color="primary" onClick={detailPage}>
            Edit
          </Button> &nbsp;
        {!detail.published
          ? (
            <>
              <Button variant="contained" size="small" color="primary" onClick={publish}>
                Publish
              </Button>
            </>
            )
          : (
            <>
              <Button variant="contained" size="small" color="primary" onClick={unpublish}>
                unPublish
              </Button>
            </>
            )
        } &nbsp;
        </div>
        <div>
          <Button style={{ marginBottom: '8px' }} variant="contained" size="small" color="primary" onClick={requestPage}>
            Request
          </Button>
          <Button size="small" color="primary" onClick={deleteListing}>
            Delete
          </Button>
        </div>
      </CardActions>
    </Card>
  );
}

export default ListingElement;
