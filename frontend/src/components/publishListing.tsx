import React, { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

type DateType = Date | null;
interface Availability {
  start: DateType;
  end: DateType;
}

const Publish = () => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState<Availability[]>([{ start: null, end: null }]);
  const back = () => {
    navigate('/hostedListing')
  }

  const publish = () => {
    alert('successfuly published!')
    console.log(availability);
    navigate('/hostedListing')
  }

  // const [availability, setAvailability] = useState([{ start: null, end: null }]);
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
    // newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  }

  const addDatePicker = () => {
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
          {/* Available Date: <br /> */}
          <DatePicker value={datePickerGroup.start} onChange={(newValue) => updateAvailability(index, 'start', newValue)} sx={{ margin: 'auto' }} label="Available From: *" />
          <DatePicker value={datePickerGroup.end} onChange={(newValue) => updateAvailability(index, 'end', newValue)} label="Available To: *" />
        </Box>
        <br />
      </>
    )
  }

  // const [datePickers, setDatePickers] = useState([<DatePickerComponent key={0} />]);
  // const addDatePicker = () => {
  //   setDatePickers([
  //     ...datePickers,
  //     <DatePickerComponent key={datePickers.length} />,
  //   ]);
  // };

  return (
    <Box
        sx={{
          width: 500,
          maxWidth: '100%',
          margin: 'auto',
          textAlign: 'center'
        }}
    >
      <Typography variant="h4" gutterBottom>
        Publish a listing
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* {datePickers.map((DatePickerComponent) => DatePickerComponent)} */}
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

export default Publish
