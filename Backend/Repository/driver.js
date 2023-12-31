const getConnection = require('../Config/database');
const constant = require("./constants")
const user = require("./user")

//appointment e total fare rakhte hobe
const patientList =         "SELECT a.patient_id,u.uname, u."+ constant.TABLE_USER_MOBILE_NO + ", a.date, a.time " +
                            "FROM booking a " +
                            "JOIN driver n ON a.driver_id = n.driver_id " +
                            "JOIN users u ON a.patient_id = u.uid " +
                            "WHERE a.driver_id = $1 AND a.type = 'Ambulance'"

const patientAddr = "Select street,thana,city,district from patient where pid = $1";
const patientListDetails_driver = async (drid) => {
    try {
        const client = await getConnection.connect();
        
        const result = await client.query(patientList, [drid]);
        for (let i = 0; i < result.rows.length; i++) {
            const addr  = await client.query(patientAddr,[result.rows[i].patient_id]);
            result.rows[i].addr = addr.rows[0].street + ", " + addr.rows[0].thana + ", " +addr.rows[0].city + ", " + addr.rows[0].district;
        }
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}



const getDriverProfile = async (driver_id) => {
    try {
        const client = await getConnection.connect();
        const profileQuery = `
            SELECT
                u.uname AS name,
                u.mobile_no AS mobile_no,
                dr.street,dr.thana,dr.district,dr.city 
            FROM driver dr
            JOIN users u ON dr.driver_id = u.uid
            WHERE u.uid = $1
        `;
        const result = await client.query(profileQuery, [driver_id]);
        client.release();
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching driver profile:', error.message);
    }
};


const update_user = "UPDATE users SET " + constant.TABLE_USER_MOBILE_NO + " = $1 " + 
                   // , " + constant.TABLE_USER_EMAIL + " = $2 " +
                    "WHERE " + constant.TABLE_USER_ID + " = $2";


const updateProfile = "UPDATE driver SET " + constant.TABLE_DRIVER_STREET + " = $1, " +
                        constant.TABLE_DRIVER_THANA + " = $2, " +       
                        constant.TABLE_DRIVER_CITY + " = $3, " +
                        constant.TABLE_DRIVER_DISTRICT + " = $4 " +
                        "WHERE " + constant.TABLE_DRIVER_ID + " = $5";


const update_profile = async (did, mobile_no,street,thana,city,district) => {
    try {
        const client = await getConnection.connect();
        const result2 = await client.query(update_user, [mobile_no, did]);
        const result = await client.query(updateProfile, [street,thana,city,district,did]);
        client.release();
        return result.rowsAffected === 1;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

                    
module.exports = {
    patientListDetails_driver,
    getDriverProfile,
    update_profile
}