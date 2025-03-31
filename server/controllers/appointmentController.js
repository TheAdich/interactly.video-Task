const { pool } = require('../db.js');

const createAppointment = async (req, res) => {
    try {
        const { affirmation, notice_period, current_ctc, expected_ctc, date, username, jobId } = req.body;

        if (!affirmation) {
            return res.status(200).json({ message: 'Appointment not created' });
        }

        if (!notice_period || !current_ctc || !expected_ctc || !date) {
            return res.status(400).json({ message: 'Invalid data' });
        }


        const utcDate = new Date(date).toISOString();

       
        const query = `SELECT * FROM appointment 
        WHERE created_at BETWEEN ($1::timestamptz - INTERVAL '1 hour') 
        AND ($1::timestamptz + INTERVAL '1 hour')`;

        const isAppointmentOverlap = await pool.query(query, [utcDate]);
        
        if (isAppointmentOverlap.rowCount > 0) {
            return res.status(400).json({ message: 'Appointment already exists' });
        }

        await pool.query('BEGIN');

        const user = await pool.query(`SELECT * FROM client WHERE username=$1`, [username]);
        if (user.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ message: 'User not found' });
        }

        const userId = user.rows[0].id;

        const candidate = await pool.query(
            `INSERT INTO candidate (clientid, current_ctc, expected_ctc, notice_period)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, current_ctc, expected_ctc, notice_period]
        );

        if (candidate.rowCount > 0) {
            const insertQuery = `INSERT INTO appointment (candidate_id, job_id, created_at) 
            VALUES ($1, $2, $3::timestamp AT TIME ZONE 'UTC') RETURNING *`;
            
            const appointment = await pool.query(insertQuery, [candidate.rows[0].id, jobId, utcDate]);

            if (appointment.rowCount > 0) {
                await pool.query('COMMIT');
                return res.status(201).json({ message: 'Appointment Created Successfully' });
            }
        }

        await pool.query('ROLLBACK');
        return res.status(400).json({ message: 'Error creating appointment' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.log(err);
        return res.status(400).json({ message: 'Error creating appointment' });
    }
};

module.exports = { createAppointment };

