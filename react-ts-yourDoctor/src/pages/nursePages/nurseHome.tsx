import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderDoctor from '../navbar/headerdoctor';
import Footer from '../navbar/footer';
import NurseImage from '@/assets/nurse.jpg';

function NurseHome() {
  const [selectedSection, setSelectedSection] = useState('upcoming');
  const [isActive, setIsActive] = useState(true);
  const [nurseName, setNurseName] = useState('');
  const [designation, setDesignation] = useState('');
  const [testData, setTestData] = useState<
    Array<{
      name: string;
      patient: string;
      date: string;
    }>
  >([]);
  useEffect(() => {
    // Fetch doctor's name from the database here
    // For now, let's simulate fetching the name after a delay
    setTimeout(() => {
      setNurseName('XYZ'); // Simulated fetched name
    }, 1000);
    setTimeout(() => {
      setDesignation('Head Nurse'); // Simulated fetched name
    }, 1000);
    setTimeout(() => {
      const fetchedtestData = [
        {
          name: 'Blood Glucose Test',
          patient: 'Aksa',
          date: '2023-08-01',
        },
        {
          name: 'Blood pressure Test',
          patient: 'Sara',
          date: '2023-08-02',
        },
        {
          name: 'Diabetes Test',
          patient: 'NNl',
          date: '2023-08-21',
        },
        {
          name: 'X-ray',
          patient: 'Jara',
          date: '2023-08-30',
        },
      ];
      setTestData(fetchedtestData);
    }, 1500);
  }, []);

  const handleStatusToggle = () => {
    // Update isActive state and send the new status to the database
    const newStatus = !isActive;
    setIsActive(newStatus);

    // Simulate sending the new status to the database
    // Replace this with your actual database update logic
    // For now, we'll use a setTimeout to simulate the update
    setTimeout(() => {
      // Simulated database update success
      console.log(`Nurse status updated to: ${newStatus}`);
    }, 1000);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const currentDate = new Date().toISOString().split('T')[0];

  const TestsToShow =
    selectedSection === 'upcoming'
      ? testData.filter((test) => test.date > currentDate)
      : selectedSection === 'previous'
      ? testData.filter((test) => test.date <= currentDate)
      : [];
  return (
    <>
      <div>
        <HeaderDoctor />
      </div>
      <div className="pt-20 bg-teal-200">
        <div className="flex justify-between mx-4 items-center">
          <p className="text-gray-700">{nurseName}</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 h-screen">
        <div className="flex flex-col items-center">
          <div>
            <p className="text-xl font-bold text-black">
              {nurseName} - {isActive ? 'Available' : 'On Duty'}
            </p>
            <button
              type="button"
              onClick={handleStatusToggle}
              className={`px-4 py-2 rounded-lg ${
                isActive ? 'bg-green-500' : 'bg-red-500'
              } text-white`}
            >
              {isActive ? 'Available' : 'On Duty'}
            </button>
          </div>
          <div className="mb-4 mt-4">
            <img
              src={NurseImage}
              alt="Nurse"
              className="w-32 h-32 rounded-full"
            />
          </div>
          <h1 className="text-2xl font-semibold mb-2">{nurseName}</h1>
          <p className="text-lg text-gray-600 mb-4">
            Designation: {designation}
          </p>
          <div className="mt-4">
            <Link to="NurseProfileUpdate">
              <button
                type="button"
                className="bg-teal-500 px-4 py-2 rounded-lg text-white"
              >
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 ml-8">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg ${
                selectedSection === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600'
              } hover:bg-blue-600 hover:text-white`}
              onClick={() => handleSectionChange('upcoming')}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg ${
                selectedSection === 'previous'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600'
              } hover:bg-blue-600 hover:text-white`}
              onClick={() => handleSectionChange('previous')}
            >
              Previous
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">
              {selectedSection === 'upcoming' ? 'Upcoming' : 'Previous'} Tests
            </h2>
            <ul className="space-y-4">
              {TestsToShow.map((test, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{test.name}</p>
                    <p className="text-gray-600">{test.patient}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{test.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </>
  );
}

export default NurseHome;