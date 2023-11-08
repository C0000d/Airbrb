import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

interface eleProps {
  listingId: string;
  // title: string;
  // description: string;
  // imageUrl: string;
}

const ListingElement = (props: eleProps) => {
  const storeId = () => {
    localStorage.setItem('listingId', props.listingId)
  }

  return (
    <Card sx={{ maxWidth: 345 }} onClick={storeId}>
      <CardActionArea >
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Title:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Property Type: house
            &nbsp;&nbsp;| No. of beds: 5<br />
            No. of bathrooms:
            &nbsp;&nbsp;| Price (per night): 999<br />
            Rating: <br />
            Number of total reviews:
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Edit
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default ListingElement;
