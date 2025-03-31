const { pool } = require('../db.js');

const createJob = async (req, res) => {
    try {

        const { title, company, description, requirements, clientId } = req.body;
        const query = `INSERT INTO job (title,company,description,requirements,clientId)
        VALUES ($1,$2,$3,$4,$5)`
        await pool.query('BEGIN');
        const job = await pool.query(query, [title, company, description, requirements, clientId]);
        //console.log(job);
        await pool.query('COMMIT');
        return res.status(201).json({ message: 'Job Created Successfully' })


    } catch (err) {
        await pool.query('ROLLBACK')
        console.log(err);
        return res.status(400).json({ message: 'Error creating job' });
    }
}

const jobById = async (req, res) => {
    try {
        const id = req.query.id;
        const query = `SELECT * FROM job where id=$1`;
        const job = await pool.query(query, [id]);
        if (job.rowCount === 0) {
            return res.status(400).json({ message: 'Cannot find the requested job' });
        }
        return res.status(200).json(job.rows[0]);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error in Getting Job' })
    }
}

const getAllJobs = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await pool.query(`SELECT * FROM client WHERE id=$1`, [id]);
        if (user.rows[0].role === 'admin') {
            const jobs = await pool.query(`SELECT * FROM job where clientId=$1`, [id]);
            if (jobs.rowCount === 0) {
                return res.status(400).json({ message: 'No Jobs Found' });
            }
            return res.status(200).json(jobs.rows);
        }
        else {
            const allJobs = await pool.query(`SELECT * FROM job`);
            if (allJobs.rowCount === 0) {
                return res.status(400).json({ message: 'No Jobs Found' });
            }
            return res.status(200).json(allJobs.rows);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error in getting Jobs' })
    }
}

const appliedJobs = async (req, res) => {
    try {
        const id = req.params.id;
        //console.log(id);
        const query = `SELECT j.id , j.title, j.company, j.description,j.requirements, j.created_at,t.candidate_id
        from job as j
        inner join appointment as t on j.id=t.job_id
        inner join candidate as c on t.candidate_id=c.id
        inner join client as cl on cl.id=c.clientid where cl.id=$1`;
        const appliedJobs = await pool.query(query, [id]);
        if (appliedJobs.rowCount === 0) {
            return res.status(400).json({ message: 'No Jobs Found' });
        }
        return res.status(200).json(appliedJobs.rows);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error in getting Applied Jobs' })
    }
}

const deleteJob = async (req, res) => {
    try {

        const id = req.body;
        const query = `SELECT * FROM job where id=$1`;
        const job = await pool.query(query, [id]);
        if (job.rowCount === 0) {
            return res.status(400).json({ message: 'Cannot find the requested job' });
        }
        await pool.query('BEGIN');
        const deleteQuery = `DELETE FROM job where id=$1`;
        await pool.query(deleteQuery, [id]);
        await pool.query('COMMIT');
        return res.status(200).json({ message: 'Job Delete Successfully' });

    } catch (err) {
        await pool.query('ROLLBACK');
        console.log(err);
        return res.status(400).json({ message: 'Error in Deleting Job' })
    }

}

const getAllCandidate = async (req, res) => {
    try {
        const id = req.query.id;
        const query = `with getcandidates  as (
	                    select *
	                    from appointment 
	                    where job_id=$1
                    )
                    select cl.username, cl.email, cl.phoneno,  c.current_ctc, c.expected_ctc,c.notice_period, t.created_at
                    from getcandidates  as t
                    inner join candidate as c on c.id=t.candidate_id
                    inner join client as cl on cl.id=c.clientid`
        const candidates = await pool.query(query, [id]);
        return res.status(200).json(candidates.rows);    
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error in getting Candidates' })
    }
}

module.exports = { createJob, jobById, deleteJob, getAllJobs, appliedJobs,getAllCandidate }