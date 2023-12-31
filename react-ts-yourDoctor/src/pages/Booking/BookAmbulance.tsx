/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';
import { useNavigate,useLocation } from 'react-router-dom';
import { bookAmbulance } from '@/api/apiCalls';
import {
  Button,
  Typography,
  TextField,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Paper,
  Grid,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from '../navbar/header_nd';
import Footer from '../navbar/footer';
function BookAmbulance() {
  const location = useLocation();
  // const navigate = useNavigate();
  const { driverName, driverID, price, hospitalName,  } = location.state;
  const navigator = useNavigate();

  // const {  } = ;
  const [formData, setFormData] = useState<{
    patient_mobile: string;
    date: string;
    time: string;
    end_time: string;
    payment_method: string;
    price: number;
    payment_status: string;
    driver_id: unknown;
    hospital_name: string | null; // Explicitly define the type as string or null
  }>({
    patient_mobile: '',
    date: '',
    time: '',
    end_time: '',
    payment_method: '',
    price: parseInt(price, 10),
    payment_status: '',
    driver_id: driverID,
    hospital_name: ' ', // Initialize hospital_name as an empty string
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Update payment_status based on payment_Method
    const paymentStatus =
      value === 'Cash' ? 'Pending' : value !== '' ? 'paid' : '';

    // const hospitalname = value === 'Online' ? null : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      payment_status: paymentStatus,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formattedTime = format(new Date(formData.time), 'HH:mm:ss');
      
      const formattedEndTime = format(new Date(formData.end_time), 'HH:mm:ss');
      //add 1 hr to end time
      var d = new Date(formData.end_time);
      d.setHours(d.getHours() + 5);
      const formattedEndTimePlusOne = format(new Date(d), 'HH:mm:ss');
      if (formattedTime > formattedEndTime) {
        alert('Start time must be less than end time');
        return;
      }
      
      const formattedDate = format(new Date(formData.date), 'yyyy-MM-dd');
      if (formattedDate < format(new Date(), 'yyyy-MM-dd')) {
        alert('Date must be greater than today');
        return;
      }
      const dataToSend = {
        ...formData,
        date: formattedDate,
        time: formattedTime,
        end_time: formattedEndTimePlusOne,
        hospital_name: formData.hospital_name,
      };

      const res = await bookAmbulance(dataToSend);
      if (res.result!= "Driver is not available at this time.") {
        alert('Ambulance Booked Successfully');
        navigator('/userHome')
      }
      else {
        alert('Driver is not available at this time.')
      }
      
    } catch (err) {
      console.log(err);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (date: any) => {
    setFormData((prevData) => ({ ...prevData, date }));
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTimeChange = (time: any) => {
    setFormData((prevData) => ({ ...prevData, time }));
  };

  const handleEndTimeChange = (end_time: any) => {
    setFormData((prevData) => ({ ...prevData, end_time }));
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="text-above-line my-10 text-left p-20">
          <p className="text-gray-400">Ambulance Booking</p>
          <hr className="line-below-text my-4 border-t-2 border-gray-300" />

          <Grid container>
            <Grid item xs={12} md={6}>
              <Paper className="p-4">
                <h1 className="text-sm font-bold text-green-500">
                  Driver {driverName}
                </h1>
                <hr />
                <div className="mb-8 mt-8">
                  <TextField
                    type="text"
                    id="patient_mobile"
                    name="patient_mobile"
                    label="Your Mobile no."
                    value={formData.patient_mobile}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md rounded-lg"
                  />
                </div>
                <div className="mb-8">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="order date"
                      value={formData.date}
                      onChange={handleDateChange}
                    />
                  </LocalizationProvider>
                </div>
                <div className="mb-8">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="delivery start Time"
                      value={formData.time}
                      onChange={handleTimeChange}
                    />
                  </LocalizationProvider>
                </div>
                <div className="mb-8">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="delivery end Time"
                      value={formData.end_time}
                      onChange={handleEndTimeChange}
                    />
                  </LocalizationProvider>
                </div>
                <div className="mb-8">
                  <RadioGroup
                    row
                    name="hospital_name"
                    value={formData.hospital_name}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value={hospitalName}
                      control={<Radio />}
                      label={hospitalName}
                    />
                  </RadioGroup>

                  <div className="mt-4">
                    <Typography
                      variant="h6"
                      className="text-sm font-bold text-green-500"
                    >
                      Ambulance fare : {formData.price}
                    </Typography>
                    <hr />
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="p-4 ml-14 w-25">
                <h1 className="text-sm font-bold text-green-500">
                  Choose Payment Method
                </h1>
                <hr />
                <FormControl component="fieldset">
                  <RadioGroup
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Cash"
                      control={<Radio />}
                      label="Cash On delivery"
                      className="mt-4"
                    />
                    {/* <FormControlLabel
                      value="Bkash"
                      control={<Radio />}
                      label="Bkash"
                      className="mt-4"
                    />
                    <FormControlLabel
                      value="Nagad"
                      control={<Radio />}
                      label="Nagad"
                      className="mt-4"
                    />
                    <FormControlLabel
                      value="Rocket"
                      control={<Radio />}
                      label="Rocket"
                      className="mt-4"
                    /> */}
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="success"
            className="text-lg rounded-lg py-1.5"
            // onClick={() => navigate(-1)}
          >
            Confirm
          </Button>
        </div>
      </form>

      <div className="mt-16">
        <Footer />
      </div>
    </>
  );
}

export default BookAmbulance;
