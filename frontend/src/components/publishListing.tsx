import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

type DateType = Date | null;
interface Availability {
  start: DateType;
  end: DateType;
}

const Publish = () => {
  const navigate = useNavigate();
  let [availability, setAvailability] = useState<Availability[]>([{ start: null, end: null }]);
  const back = () => {
    navigate('/hostedListing');
  }

  const publish = async () => {
    if (availability.length === 1) {
      for (const date of availability) {
        if (date.start === null || date.end === null) {
          alert('Please add at least one available date!');
          return;
        }
      }
    } else {
      for (const date of availability) {
        if ((date.start === null && date.end !== null) || (date.start !== null && date.end === null)) {
          alert('Invalid input! Please check all fields!');
          return;
        }
      }
    }
    availability = availability.filter(date => date.start !== null && date.end !== null);
    const token = localStorage.getItem('token');
    const listingId = localStorage.getItem('listingId');
    const response = await fetch(`http://localhost:5005/listings/publish/${listingId}`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('successfuly published!');
      navigate('/hostedListing');
    }
  }

  const updateAvailability = (index: number, field: keyof Availability, value: DateType) => {
    const newAvailability = [...availability];
    const currentAvailability = newAvailability[index];
    if (!currentAvailability) {
      return;
    }

    if (field === 'start') {
      newAvailability[index] = { ...currentAvailability, start: value };
    } else if (field === 'end') {
      newAvailability[index] = { ...currentAvailability, end: value };
    }
    setAvailability(newAvailability);
  }

  const addDatePicker = () => {
    for (const date of availability) {
      if (date.start === null || date.end === null) {
        alert('Please fill all the fields!');
        return;
      }
    }
    setAvailability([...availability, { start: null, end: null }]);
  };

  const DatePickerComponent = ({ index }: { index: number }) => {
    const datePickerGroup = availability[index];
    if (!datePickerGroup) {
      return null;
    }

    return (
      <>
        <br />
        <Box>
          <DatePicker data-cy="publish-start-date" data-testid="startDatePicker" disablePast value={datePickerGroup.start} onChange={(newValue) => updateAvailability(index, 'start', newValue)} sx={{ margin: 'auto' }} label="Available From: *" />
          <DatePicker disablePast value={datePickerGroup.end} onChange={(newValue) => updateAvailability(index, 'end', newValue)} label="Available To: *" />
        </Box>
        <br />
      </>
    );
  };

  return (
    <Box sx={{
      width: 500,
      maxWidth: '100%',
      margin: 'auto',
      textAlign: 'center'
    }}>
      <Typography variant="h4" gutterBottom>
        Publish a listing
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {availability.map((_, index) => (
          <DatePickerComponent key={index} index={index} />
        ))}
      </LocalizationProvider>
      <br />
      <Button variant="outlined" type="button" onClick={back} style={{ marginRight: 30, marginBottom: 10 }}>Cancel</Button>
      <Button variant="contained" type="button" onClick={addDatePicker} style={{ marginRight: 30, marginBottom: 10 }}>Add More</Button>
      <Button variant="contained" type="button" onClick={publish} style={{ marginBottom: 10 }}>Submit</Button>
    </Box>
  );
}

export default Publish;
