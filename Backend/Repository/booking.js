const getConnection = require('../Config/database');
const constant = require("./constants")
const user = require("./user")


const booking = "INSERT INTO " + constant.TABLE_APPOINTMENT + " ("
                + constant.TABLE_APPOINTMENT_TYPE + ", "
                + constant.TABLE_APPOINTMENT_TIME + ", "
                + constant.TABLE_APPOINTMENT_STATUS + ", "
                + constant.TABLE_APPOINTMENT_SERIAL + ", "
                + constant.TABLE_APPOINTMENT_RATING + ", "
                + constant.TABLE_APPOINTMENT_COMPLAINT_TEXT + ", "
                + constant.TABLE_APPOINTMENT_PATIENT_ID + ", "
                + constant.TABLE_APPOINTMENT_DOCTOR_ID + ", "
                + constant.TABLE_APPOINTMENT_NURSE_ID + ", "
                + constant.TABLE_APPOINTMENT_DRIVER_ID + ") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";

// need to be checked again 
// better to insert with type 
//include total fare
const BookingInsert = async (type, time, status, serial, rating, complaint_text, patient_id, doctor_id, nurse_id, driver_id) => {
    const client = await getConnection();
    try {
        //await client.query("BEGIN");
        const res = await client.query(booking, [type, time, status, serial, rating, complaint_text, patient_id, doctor_id, nurse_id, driver_id]);
        //await client.query("COMMIT");
        return res;
    } catch (error) {
        //await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    BookingInsert
}