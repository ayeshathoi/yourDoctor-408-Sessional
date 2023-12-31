const getConnection = require('../Config/database');
const constant = require("./constants")
const user = require("./user")


const remove = "DELETE FROM booking WHERE booking_id = $1"
const remove_book_test = "DELETE FROM booking_tests WHERE booking_id = $1"

const remove_booking = async (booking_id) => {
    try {
        const client = await getConnection.connect();

        const result2 = await client.query(remove_book_test, [booking_id]);

        const result = await client.query(remove, [booking_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error deleting data:', error.message);
    }
}

const Available_Doctor = "SELECT u.email,u,user_type, u.uname, u."+ constant.TABLE_USER_MOBILE_NO + ", d.speciality ,u.email " +
                        "FROM doctor_hospital dh " +
                        "JOIN doctor d ON dh.doctor_id = d.doctor_id " +
                        "JOIN users u ON dh.doctor_id = u.uid " +
                        "WHERE dh.hospital_id = $1 AND d.employee_status = 'Available'" 
    
const availableDoctor = async (hid) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(Available_Doctor, [hid]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const hospitalName = "Select hospital_name from hospital"

const hospital_name = async () => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(hospitalName, []);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}



const AVAILABE_NURSE =  "SELECT u.email,u,user_type,u.uname, u."+ constant.TABLE_USER_MOBILE_NO + ", n.designation,u.email " +
                        "FROM nurse n " +
                        "JOIN users u ON n.nurse_id = u.uid " +
                        "WHERE n.hospital_id = $1 AND n.employee_status = 'Available'" 


const available_nurse = async (hid) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(AVAILABE_NURSE, [hid]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const AVAILABE_Driver = "SELECT u.email,u.user_type,u.uname, u."+ constant.TABLE_USER_MOBILE_NO + ",u.email, d.ambulance_type " +
                        "FROM driver d " +
                        "JOIN users u ON d.driver_id = u.uid " +
                        "WHERE d.hospital_id = $1 AND d.employee_status = 'Available'" 

const available_driver = async (hid) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(AVAILABE_Driver, [hid]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}


const ADD_TEST = "INSERT INTO test (testid,testname,price, hospital_id) VALUES ($1, $2, $3,$4)"
const last_test_id = "SELECT testid FROM test ORDER BY testid DESC LIMIT 1"

const addtest = async (testname, price, hospital_id) => {
    try {
        const client = await getConnection.connect();
        const id = await client.query(last_test_id);
        if (id.rows.length == 0){
            const result = await client.query(ADD_TEST, [1,testname, price, hospital_id]);
            client.release();
            return result.rows;
        }
        const result = await client.query(ADD_TEST, [id.rows[0].testid + 1,testname, price, hospital_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const show_test = "SELECT * FROM test WHERE hospital_id = $1"

const showtest = async (hospital_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(show_test, [hospital_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}



const update_Price = "UPDATE test SET price = $1 WHERE testname = $2 AND hospital_id = $3"

const updateTESTPrice = async (testname, price, hospital_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(update_Price, [price, testname, hospital_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const delete_test = "DELETE FROM test WHERE testid = $1 AND hospital_id = $2"

const deleteTEST = async (testid, hospital_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(delete_test, [testid, hospital_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error deleting data:', error.message);
    }
}



// update employee status of doctor/nurse/driver
const find_id = "SELECT uid,user_type FROM users WHERE " + constant.TABLE_USER_EMAIL + "= $1"
const fetchDoctorIdsQuery = "SELECT doctor_id FROM doctor_hospital WHERE hospital_id = $1 AND doctor_id = $2";
const update_doctor_employee = "UPDATE doctor SET employee_status = 'Available' "+
                                "WHERE doctor_id = $1"
const update_nurse_employee = "UPDATE nurse SET employee_status = 'Available' WHERE nurse_id = $1 AND hospital_id = $2"
const update_driver_employee = "UPDATE driver SET employee_status = 'Available' WHERE driver_id = $1 AND hospital_id = $2"

const update_employee_hospital = async (email, hospital_id) => {
    try {
        const client = await getConnection.connect();
        const found_id = await client.query(find_id, [email]);
        const id = found_id.rows[0].uid;
        const employee_type = found_id.rows[0].user_type;
        if(employee_type == "doctor"){
            const doctor_find = await client.query(fetchDoctorIdsQuery, [hospital_id,id]);
            if (doctor_find.rows.length > 0){
                const doctor_id_in_hospital = doctor_find.rows[0].doctor_id;
                const result = await client.query(update_doctor_employee, [doctor_id_in_hospital]);
                client.release();
                return result.rows;   
            }       
        }
        else if(employee_type == "nurse"){
            const result = await client.query(update_nurse_employee, [id, hospital_id]);
            client.release();
            return result.rows;
        }
        else if(employee_type == "driver"){
            const result = await client.query(update_driver_employee, [id, hospital_id]);
            client.release();
            return result.rows;
        }
        client.release();
        return ;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}
//------------------------------------------------------------------------

//------------------assign nurse to test------------------//
const update_appointment_status = "UPDATE booking SET booking_status = 'approved' , nurse_id =$1 WHERE booking_id = $2"
const booking_find = "SELECT * FROM booking WHERE booking_id = $1"
const check_nurse = "Select * from booking where nurse_id = $1 AND time = $2 AND date = $3"
const assign_nurse_to_test = async (nurse_email, booking_id) => {
    try {
        const client = await getConnection.connect();
        const nurse = await client.query(find_id,[nurse_email]);
        const nurse_id = nurse.rows[0].uid;
        const booking = await client.query(booking_find,[booking_id]);
        const time = booking.rows[0].time;
        const date = booking.rows[0].date;
        const check = await client.query(check_nurse,[nurse_id,time,date]);
        if(check.rows.length > 0){
            return "Nurse is booked in this slot";
        }


        //check 3 hr age piche kina onno booking er sathe


        const result2 = await client.query(update_appointment_status, [nurse_id,booking_id]);
        return "nurse is successfully assigned";
        client.release();
        
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

//--------------------------------------------//

const all_booking = "SELECT * FROM booking b " +
"WHERE b.hospital_id = $1 and b.booking_status = $2 "
const patient_name_search = "SELECT u.uname FROM users u Where u.uid = $1"
const booking_total = async (hospital_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(all_booking, [hospital_id,"pending"]);
        for (let i = 0; i < result.rows.length; i++) {
            const patient_name = await client.query(patient_name_search, [result.rows[i].patient_id]);
            result.rows[i].patient_name = patient_name.rows[0].uname;
        }
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}



const show_complaint_text = "SELECT r.complaint_text FROM review r " +
                        "JOIN booking b ON r.booking_id = b.booking_id " +
                        "WHERE b.booking_id = $1 AND b.hospital_id = $2"

const show_complaint = async (booking_id,hospital_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(show_complaint_text, [booking_id,hospital_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

// show patient request for check up test non assigned
const show_patient_request = "SELECT u.uname, b.date, b.booking_status, b.type " +
                            "FROM booking b " +
                            "JOIN users u ON b.patient_id = u.uid " +
                            "WHERE b.hospital_id = $1 AND b.booking_status = 'pending' AND b.type = 'Checkup'"

const show_patient_request_checkup = async (hospital_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(show_patient_request, [hospital_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}


const show_pending_tests = "SELECT t.testname , t.price "
                            +"FROM test t "
                            +"JOIN booking_tests bt ON t.testid = bt.test_id "
                            +"JOIN booking b ON bt.booking_id = b.booking_id " +
                            "WHERE bt.booking_id = $1"

const pending_test = async (booking_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(show_pending_tests, [booking_id]);   
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const Pending_Doctor = "SELECT u.uid, u.user_type, u.uname, u."+ constant.TABLE_USER_MOBILE_NO + ", d.speciality ,u.email " +
                        "FROM doctor_hospital dh " +
                        "JOIN doctor d ON dh.doctor_id = d.doctor_id " +
                        "JOIN users u ON dh.doctor_id = u.uid " +
                        "WHERE dh.hospital_id = $1 AND d.employee_status = 'pending'" 


const pendingDoctor = async (hid) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(Pending_Doctor, [hid]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const Pending_Nurse = "SELECT u.uid, u.user_type, u.uname, u."+ constant.TABLE_USER_MOBILE_NO + ",n.designation, u.email " +
                        "FROM nurse n "+
                        "JOIN users u ON n.nurse_id = u.uid " +
                        "WHERE n.hospital_id = $1 AND n.employee_status = 'pending'" 

const pendingNurse = async (hid) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(Pending_Nurse, [hid]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const Pending_Drivers = "SELECT u.uid, u.user_type, u.uname, u."+ constant.TABLE_USER_MOBILE_NO + ",n.ambulance_type, u.email " +
                        "FROM driver n "+
                        "JOIN users u ON n.driver_id = u.uid " +
                        "WHERE n.hospital_id = $1 AND n.employee_status = 'pending'" 

const pendingDriver = async (hid) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(Pending_Drivers, [hid]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

//doctor er doctor_hospital table e pending_status rakhte hobe prolly
//
//const find_id = "SELECT uid,user_type FROM users WHERE " + constant.TABLE_USER_EMAIL + "= $1"
const fetchDoctorIdsQuery_pending = "SELECT doctor_id FROM doctor_hospital WHERE hospital_id = $1 AND doctor_id = $2";
const update_doctor_employee_pending = "UPDATE doctor SET employee_status = 'deleted' "+
                                "WHERE doctor_id = $1"
const update_nurse_employee_pending = "UPDATE nurse SET employee_status = 'deleted' WHERE nurse_id = $1 AND hospital_id = $2"
const update_driver_employee_pending = "UPDATE driver SET employee_status = 'deleted' WHERE driver_id = $1 AND hospital_id = $2"

const remove_employee_hospital = async (email, hospital_id) => {
    
    try {
        const client = await getConnection.connect();
        const found_id = await client.query(find_id, [email]);
        const id = found_id.rows[0].uid;
        const employee_type = found_id.rows[0].user_type;
        if(employee_type == "doctor"){
            const doctor_find = await client.query(fetchDoctorIdsQuery_pending, [hospital_id,id]);
            if (doctor_find.rows.length > 0){
                const doctor_id_in_hospital = doctor_find.rows[0].doctor_id;
                const result = await client.query(update_doctor_employee_pending, [doctor_id_in_hospital]);
                client.release();
                return result.rows;
            }
        }
        else if(employee_type == "nurse"){
            const result = await client.query(update_nurse_employee_pending, [id, hospital_id]);
            client.release();
            return result.rows;
        }
        else if(employee_type == "driver"){
            const result = await client.query(update_driver_employee_pending, [id, hospital_id]);
            client.release();
            return result.rows;
        }
        client.release();
        return ;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}


const oneBooking = "SELECT * FROM booking b " +
"WHERE b.hospital_id = $1 AND b.booking_id = $2 AND b.nurse_id IS NULL"
const booking_tests = "SELECT * FROM booking_tests WHERE booking_id = $1";
const testsDetails = "SELECT * FROM test WHERE testid = $1";
const booking_one = async (hospital_id, booking_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(oneBooking, [hospital_id,booking_id]);
        const tests = await client.query(booking_tests, [booking_id]);
        
        for (let i = 0; i < tests.rows.length; i++) {
            const test = await client.query(testsDetails, [tests.rows[i].test_id]);
            tests.rows[i].testname = test.rows[0].testname;
            tests.rows[i].price = test.rows[0].price;
        }

        result.rows[0].tests = tests.rows;

       

        for (let i = 0; i < result.rows.length; i++) {
            const patient_name = await client.query(patient_name_search, [result.rows[i].patient_id]);
            
            result.rows[i].patient_name = patient_name.rows[0].uname;
        }
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}


const onetest = async (test_id) => {
    try {
        const client = await getConnection.connect();
        const result = await client.query(testsDetails, [test_id]);
        client.release();
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
}




module.exports = {
    availableDoctor,
    available_nurse,
    available_driver,
    addtest,
    updateTESTPrice,
    update_employee_hospital,
    assign_nurse_to_test,
    show_complaint,
    booking_total,
    show_patient_request_checkup,
    pending_test,
    pendingDoctor,
    pendingNurse,
    showtest,
    remove_employee_hospital,
    booking_one,
    onetest,
    deleteTEST,
    pendingDriver,
    hospital_name,
    remove_booking
}