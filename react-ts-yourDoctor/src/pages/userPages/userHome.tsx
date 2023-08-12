import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../navbar/header_user';
import Footer from '../navbar/footer';
import User from '@/assets/user.webp';
import AppointmentImage from '@/assets/appointment.jpg';
import AmbulanceImage from '@/assets/ambulance.jpg';
import HealthCheckImage from '@/assets/healthcheckhome.jpg';

function UserHome() {
  const [user, setUser] = useState({
    name: '',
    contact: '',
  });
  const { userid } = useParams();
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/userprofile/${userid}')
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((error) => {
        console.error('userprofile not found', error);
      });
  }, [userid]);

  if (!user) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }
  return (
    <>
      <div>
        <Header />
      </div>
      <div className="mt-10 flex items-center justify-center h-screen bg-blue-50">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <img src={User} alt="User" className="w-32 h-32 rounded-full" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Name:{user.name}</h1>
          <p className="text-lg text-gray-600 mb-4">User</p>
          <p className="text-lg text-gray-600 mb-4">Contact:{user.contact}</p>
          <div>
            <Link to="PatientProfileUpdate">
              <button
                type="button"
                className="bg-teal-500 px-4 py-2 rounded-lg text-white"
              >
                Edit Profile
              </button>
            </Link>
          </div>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Link to="Appointments">
              <img
                src={AppointmentImage}
                alt="AppointmentImage"
                className="w-60 h-60 cursor-pointer gap-10"
              />
              <p className="mt-2 font-bold text-lg text-gray-800 hover:underline">
                Appointments
              </p>
            </Link>
            <Link to="Tests">
              <img
                src={HealthCheckImage}
                alt="HealthCheckImage"
                className="w-60 h-60 cursor-pointer gap-10 ml-16"
              />
              <p className="mt-2 ml-16 font-bold text-lg text-gray-800 hover:underline">
                Health Check Tests
              </p>
            </Link>
            <Link to="Ambulances">
              <img
                src={AmbulanceImage}
                alt="AmbulanceImage"
                className="w-60 h-60 cursor-pointer gap-10 ml-16"
              />
              <p className="mt-2 ml-16 font-bold text-lg text-gray-800 hover:underline">
                Ambulance Orders
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </>
  );
}

export default UserHome;
