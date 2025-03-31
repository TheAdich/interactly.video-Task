const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./db');
const userRouter = require('./routers/userRouter.js');
const jobRouter = require('./routers/jobRouter.js');
const appointmentRouter = require('./routers/appointmentRouter.js');
const { pool } = require('./db.js');
const { extractNoticePeriod, extractCTC, extractInterviewDate } = require('./utils/entityExtractor');
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);
app.use('/api/appointment', appointmentRouter);

const questions = [
    { id: 1, text: "Are you interested in this role?", type: "boolean" },
    { id: 2, text: "What is your current notice period?", type: "notice_period" },
    { id: 3, text: "Can you share your current CTC?", type: "ctc" },
    { id: 4, text: "Can you share your expected CTC?", type: "ctc" },
    { id: 5, text: "When are you available for an interview next week?", type: "date" }
];

app.post('/api/faq/answer', async (req, res) => {
    const { questionId, answer } = req.body;
    const question = questions.find(q => q.id === questionId);

    if (!question) {
        return res.status(400).json({ error: 'Invalid question ID' });
    }

    let extracted = { valid: false };

    try {
        switch (question.type) {
            case 'boolean':
                extracted = {
                    value: answer.toLowerCase().includes('yes'),
                    valid: answer.toLowerCase().includes('yes')
                };
                break;

            case 'notice_period':
                extracted = extractNoticePeriod(answer);
                extracted.valid = !!extracted.value;
                break;

            case 'ctc':
                extracted = extractCTC(answer);
                extracted.valid = !!extracted.value;
                break;

            case 'date':
                const date = extractInterviewDate(answer);
                extracted = { value: date, valid: !!date };

                if (date) {
                    const query = `
                            SELECT * FROM appointment 
                            WHERE created_at BETWEEN ($1::timestamptz - INTERVAL '1 hour') 
                            AND ($1::timestamptz + INTERVAL '1 hour')
                        `;

                    const isAppointmentOverlap = await pool.query(query, [date]);

                    if (isAppointmentOverlap.rowCount > 0) {
                        extracted.valid = false;
                        extracted.error = 'Appointment already exists';
                    }
                }
                break;
        }
        //console.log(extracted);
        return res.status(200).json({ extracted });
    } catch (error) {
        console.error('Extraction error:', error);
        return res.status(400).json({ error: 'Failed to extract information' });
    }

});




app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server is running!");
})