/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, ChangeEvent, FormEvent } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/headerdoctor';
import Footer from '../navbar/footer';

const cookies = new Cookies();
const COOKIE_AGE = 31536000;



const checkAuth = () => {
  return !(cookies.get('token') === undefined || cookies.get('token') === null);
};

const logout = () => {
  cookies.remove('token', { path: '/' });
};


function LogIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios
        .post('http://localhost:3000/auth/login', formData)
        .then((res) => {
          cookies.set('token', res.data.backendCookie, {
            path: '/',
            maxAge: COOKIE_AGE,
          });
          console.log('here is the token', res.data.backendCookie);

          // const { res.data.type } = res.data; // Replace with actual key
          console.log(res.data);
          let userProfileUrl = '';
          if (res.data.type === 'doctor') {
            const userId = res.data.uid;
            console.log('here is the uid', res.data.uid);
            userProfileUrl = `/doctorHome/${userId}/`;
          } else if (res.data.type === 'patient') {
            const userId = res.data.uid;
            console.log('here is the uid', res.data.uid);
            userProfileUrl = `/userHome/${userId}/`;
          } else if (res.data.type === 'driver') {
            const userId = res.data.uid;
            console.log('here is the uid', res.data.uid);
            userProfileUrl = `/driverHome/${userId}/`;
          } else if (res.data.type === 'nurse') {
            const userId = res.data.uid;
            console.log('here is the uid', res.data.uid);
            userProfileUrl = `/nurseHome/${userId}/`;
          } else if (res.data.type === 'hospital') {
            const userId = res.data.uid;
            console.log('here is the uid', res.data.uid);
            userProfileUrl = `/hospitalHome/${userId}/`;
          }
          navigate(userProfileUrl);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <p>&</p>
      </div>
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <form
            className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="text-gray-800 text-2xl flex justify-center border-b-2 py-2 mb-4 text-green-700">
              Log In
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="email"
              >
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="password"
              >
                <input
                  className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:shadow-outline"
                  name="password"
                  type="password"
                  value={formData.password}
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="px-4 py-2 rounded text-white inline-block shadow-lg bg-green-500 hover:bg-blue-600 focus:bg-blue-700"
                type="submit"
              >
                Log In
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2023 yourDoctor. All rights reserved.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LogIn;
export { checkAuth, logout };
