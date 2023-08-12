const user = require('../Repository/patient')
const http_status = require('./HTTPStatus')


const appointmentDetails = async (req, res) => {
    try {
        const pid = req.params.id;
        const appointmentDetails = await user.getAppintmentDetails(pid);
        res.status(http_status.OK).json(appointmentDetails);
    } catch (error) {
        res.status(http_status.BAD_REQUEST).json({ error: 'An error occurred while fetching user details.' });
    }
}

const ambulanceDetails = async (req, res) => {
    try {
        const pid = req.params.id;
        const ambulanceDetails = await user.ambulanceDetails(pid);
        res.status(http_status.OK).json(ambulanceDetails);
    } catch (error) {
        res.status(http_status.BAD_REQUEST).json({ error: 'An error occurred while fetching user details.' });
    }
}

const checkUpDetails = async (req, res) => {
    try {
        const pid = req.params.id;
        const checkUpDetails = await user.checkUpDetails(pid);
        res.status(http_status.OK).json(checkUpDetails);
    } catch (error) {
        res.status(http_status.BAD_REQUEST).json({ error: 'An error occurred while fetching user details.' });
    }
}



const doctor_speciality_search = async (req, res) => {
    try {
        const speciality = req.body.speciality;
        const doctorDetails = await user.doctorSpecialitySearch(speciality);
        res.status(http_status.OK).json(doctorDetails);
    } catch (error) {
        res.status(http_status.BAD_REQUEST).json({ error: 'An error occurred while fetching user details.' });
    }
}


const doctor_name_search = async (req, res) => {
    try {
        const name = req.body.name;
        const doctorDetails = await user.doctorNameSearch(name);
        res.status(http_status.OK).json(doctorDetails);
    } catch (error) {
        res.status(http_status.BAD_REQUEST).json({ error: 'An error occurred while fetching user details.' });
    }
}

const choose_test = async (req, res) => {
    console.log("ASCHIIIIII");
    try {
       
        const hospital = req.body.name;
        console.log(hospital)
        const testDetails = await user.checkUpHospitalDetails(hospital);
        res.status(http_status.OK).json(testDetails);
    } catch (error) {
        res.status(http_status.BAD_REQUEST).json({ error: 'An error occurred while fetching user details.' });
    }
}


const update_profile = async (req, res) => {
    try {
        const pid = req.params.id;
        const street = req.body.street;
        const thana = req.body.thana;
        const city = req.body.city;
        const district = req.body.district;
        const mobile = req.body.mobile;

        const updateProfile = await user.update_profile(street,thana,city, district,pid,mobile,pid);
        res.status(http_status.OK).json(updateProfile);
    } catch (error) {
        res.status(http_status.BAD_REQUEST).json({ error: 'An error occurred while fetching user details.' });
    }
}



module.exports = {
    appointmentDetails,
    ambulanceDetails,
    checkUpDetails,
    doctor_speciality_search,
    doctor_name_search,
    choose_test,
    update_profile
};