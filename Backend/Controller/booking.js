const user = require('../Repository/booking')
const http_status = require('./HTTPStatus')

const DoctorBooking = async (req, res) => {
    try {
        const uid = req.user.uid;
        const {price,time,date,payment_method,payment_status,patient_mobile,doctor_id,hospital_name,weekday} = req.body

        if(hospital_name.split(" ")[1] == "Online"){
            const hospital = hospital_name.split(" ")[0] ;
            const type="Online"
            //create an api and join dem
            const result = await user.appointmentBooking(type,weekday,price,time,date,payment_method,payment_status,patient_mobile,uid,doctor_id,hospital); 
            res.status(http_status.OK).json({ result });
        }
       else {
        const type = "Appointment";
            const result = await user.appointmentBooking(type,weekday,price,time,date,payment_method,payment_status,patient_mobile,uid,doctor_id,hospital_name); 
            if(result == "This serial is already booked.")
            {
                res.send("This serial is already booked.");
            }
            else
                res.status(http_status.OK).json({ result });
        }

    } catch (error) {
        console.error('Error :', error.message);
        res.status(http_status.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while getting available doctor.' });
    }
}

// Checkup
const selectTEST = async (req,res) =>
{
    try {
        const {test_names,hospital_name} = req.body
        const result = await user.select_test(test_names,hospital_name);
        res.status(http_status.OK).json({ result })
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const CheckupBooking = async (req, res) => {
    try {
        const uid = req.user.uid;
        const type = "Checkup";
        const {price,time,end_time,date,payment_method,payment_status,patient_mobile,hospital_name,test_names} = req.body
        const result = await user.bookingCheckup(type,price,time,end_time,date,payment_method,payment_status,patient_mobile,uid,hospital_name,test_names); 
        res.status(http_status.OK).json({ result });
    } catch (error) {
        console.error('Error :', error.message);
        res.status(http_status.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while getting available checkup.' });
    }
}
//Ambulance
const AmbulanceBooking = async (req, res) => {
    try {
        const uid = req.user.uid;
        const type = "Ambulance";
        const {price,time,end_time,date,payment_method,payment_status,patient_mobile,driver_id,hospital_name} = req.body
        if(hospital_name == undefined)
        {
        const result = await user.bookingAmbulance(type, price,time,end_time,date,payment_method,payment_status,patient_mobile,uid,driver_id,null); 
        res.status(http_status.OK).json({ result });
        }
        else
        {
            const result = await user.bookingAmbulance(type, price,time,end_time,date,payment_method,payment_status,patient_mobile,uid,driver_id,hospital_name); 
            res.status(http_status.OK).json({ result });

        }
    } catch (error) {
        console.error('Error :', error.message);
        res.status(http_status.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while getting available driver.' });
    }
}


module.exports = {
    DoctorBooking,
    CheckupBooking,
    AmbulanceBooking,
    selectTEST
}