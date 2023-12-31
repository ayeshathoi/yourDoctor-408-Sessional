/* eslint-disable import/extensions */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Paper,
  Button,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import HeaderDoctor from '../navbar/headerdoctor';
import Footer from '../navbar/footer';
import {
  editHospitalList_doctor,
  deleteTimeline_doctor,
  getDoctorDetails,
} from '@/api/apiCalls';

function EditHospiatlList() {
  const location = useLocation();
  const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [timelineData, setTimelineData] = useState([]);
  const [doctorid, setDoctorid] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Parse hospital names from the URL parameter
    const searchParams = new URLSearchParams(location.search);
    const hospitalsParam = searchParams.get('hospitals');
    if (hospitalsParam) {
      const hospitalsArray = JSON.parse(hospitalsParam);
      setHospitalNames(hospitalsArray);
    }
  }, [location.search]);

  // Fetch timeline data for the selected hospital
  useEffect(() => {
    getDoctorDetails().then((res) => {
      setDoctorid(res.uid);
    });

    if (selectedHospital) {
      editHospitalList_doctor(selectedHospital, doctorid)
        .then((res) => {
          console.log(res);
          setTimelineData(res);
        })
        .catch((error) => {
          console.error('Error fetching timeline data:', error);
        });
    }
  }, [doctorid, selectedHospital]);

  const deleteTimeline = async (timeline_id: number) => {
    try {
      deleteTimeline_doctor(timeline_id)
        .then((res) => {
          alert('Schedule Deleted Successfully');
          navigate(`/doctorHome`);
        })
        .catch((error) => {
          console.error('Error deleting timeline data:', error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTimelineData = timelineData.filter(
    (timeline) => timeline.hospital_name === selectedHospital
  );

  return (
    <>
      <div>
        <HeaderDoctor />
      </div>
      <div className="mt-40 ml-40 mr-20">
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} className="p-4">
                <Typography variant="h6" gutterBottom>
                  Select a Hospital
                </Typography>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="hospital-select-label">
                    Hospital Name
                  </InputLabel>
                  <Select
                    labelId="hospital-select-label"
                    id="hospital-select"
                    value={selectedHospital}
                    label="Hospital Name"
                    onChange={(e) => setSelectedHospital(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select a hospital</em>
                    </MenuItem>
                    {hospitalNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="h6" gutterBottom className="mt-4">
                  {selectedHospital}
                </Typography>
                <table className="max-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Weekday
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Slot
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Edit Schedule
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Delete Schedule
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTimelineData.map((timeline) => (
                      <tr key={timeline.timeline_id}>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <Typography variant="subtitle1">
                            {timeline.weekday}
                          </Typography>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <Typography variant="body2" color="textSecondary">
                            {timeline.slot}
                          </Typography>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <Typography variant="body2" color="textSecondary">
                            {timeline.start_time}
                          </Typography>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <Typography variant="body2" color="textSecondary">
                            {timeline.end_time}
                          </Typography>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <Link
                            to={`/doctorHome/EditSchedule/${timeline.timeline_id}?weekday=${timeline.weekday}&hospital_name=${selectedHospital}`}
                          >
                            <Button variant="contained" color="primary">
                              <EditCalendarOutlinedIcon />
                            </Button>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() =>
                              confirm('Are you sure?') &&
                              deleteTimeline(timeline.timeline_id)
                            }
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default EditHospiatlList;
