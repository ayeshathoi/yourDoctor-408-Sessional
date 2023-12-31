import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {ambulanceSearch} from '@/api/apiCalls';


import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Header from '../navbar/header_nd';
import Footer from '../navbar/footer';
import { add } from 'date-fns';

interface Driver {
  driver_id: number;
  driver_name: string;
  driver_phone: string;
  ambulance_type: string;
  ambulance_fare: number;
  street: string;
  thana: string;
  city: string;
  district: string;
  hospital: string;
  patient_street: string;
  patient_thana: string;
  patient_city: string;
  patient_district: string;
}

function AmbulanceSearch() {
  const [user, setuserData] = useState<Driver[]>([]);
  var address = [];
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'PriceLowToHigh' | 'PriceHighToLow' | 'Searchbycity'>('PriceLowToHigh');
  useEffect(() => {
    ambulanceSearch().then((ret) => {
    if (ret) {
      address.push(ret[0].patient_street);
      address.push(ret[0].patient_thana);
      address.push(ret[0].patient_city);
      address.push(ret[0].patient_district);
      setuserData(ret);
      setCount(ret.length);
    }
    else {
      console.log('error');
    }
  });
  });


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const checkcityanddistrict = (driver: Driver) => {  
    if (driver.city == driver.patient_city && driver.district == driver.patient_district) {
      
        navigate('/BookAmbulance', {
          state: {
            driverName: driver.driver_name,
            driverID: driver.driver_id,
            price: driver.ambulance_fare,
            hospitalName: driver.hospital,
          },
        });
    }
    else return alert('Sorry, this ambulance is not available in your area');
  };

  const getThana = () => {
    const thanaset = new Set();

    user.forEach((driver) => {
      if (!thanaset.has(driver.thana)) {
        thanaset.add(driver.thana);
      }
    });

    const thanasetArray = Array.from(thanaset);

    return thanasetArray;
  };

  const sortedDriver = [...user];

  if (sortBy === 'PriceLowToHigh') {
    sortedDriver.sort((a, b) => a.ambulance_fare - b.ambulance_fare);
  } else if (sortBy === 'PriceHighToLow') {
    sortedDriver.sort((a, b) => b.ambulance_fare - a.ambulance_fare);
  }



  const filteredDriver = sortedDriver.filter((Driver) =>
    Driver.thana.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'PriceLowToHigh' | 'PriceHighToLow');
  };

  return (
    <>
      <div>
        <Header />
      </div>

      <div className="text-above-line my-10 text-left p-20 ">
        <p className="text-xl font-medium">
          you can book only the ambulances which has same city and district as you
        </p>
        <Autocomplete
          options={getThana()}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by preferred thana"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          )}
        />
        
        <hr className="line-below-text my-4 border-t-2 border-gray-300" />

        <div className="flex justify-end items-center">
          
          <div className="text-gray-400 p-2">Sort By Price</div>
          <select
            name="sort"
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">Select</option>
            <option value="PriceLowToHigh">Price Low to High</option>
            <option value="PriceHighToLow">Price High to Low</option>
          </select>
        </div>

        <div className="flex">
          <div className="flex ml-4">
            <Grid container spacing={3}>
              {filteredDriver.map((driver, index) => (
                <Grid item xs={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt="driver"
                      height="200"
                      image="https://www.vectorjunky.com/wp-content/uploads/2017/02/Pr%20122-%20TRI%20-%2025_02_11%20-%20006.jpg"
                    />
                    <CardContent>
                      <Typography variant="h6">{driver.driver_name}</Typography>
                      <Typography variant="body2">
                        Mobile No: {driver.driver_phone}
                      </Typography>
                      <Typography variant="body2">
                        {driver.ambulance_type} Ambulance
                      </Typography>
                      <Typography variant="body2">
                        Ambulance Fare: {driver.ambulance_fare}
                      </Typography>
                      <Typography variant="body2">
                        Street   : {driver.street}
                      </Typography>
                      <Typography variant="body2">
                        Thana    : {driver.thana}
                      </Typography>
                      <Typography variant="body2">
                        City     : {driver.city}
                      </Typography>
                      <Typography variant="body2">
                        District : {driver.district}
                      </Typography>
                      <Typography variant="body2">
                        Hospital: {driver.hospital}
                      </Typography>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => checkcityanddistrict(driver)}
                      >
                        Book
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="text-gray-400 p-2"> {count} results found</div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </>
  );
}

export default AmbulanceSearch;
