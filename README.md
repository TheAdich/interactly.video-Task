# Job Appointment System

## Overview
This project is a job appointment system that allows clients to post job listings, candidates to apply for jobs, and admins to manage the system efficiently. The system integrates AI-powered speech-to-text for candidate interactions.

## Tech Stack

### Frontend
- **Next.js**
- **Tailwind CSS**

### Backend
- **Node.js**
- **Express.js**

### Database
- **PostgreSQL**

### Additional Technologies
- **Speech-to-Text (Web Browser API)**
- **Text-to-Speech (React-Speech-Kit)**

---

## API Endpoints

### **User Authentication**
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login a user

### **Jobs**
- `POST /api/job/createJob` - Create a new job
- `POST /api/job/deleteJob` - Delete a job
- `GET /api/job/getById` - Get job by ID
- `GET /api/job/getAllJobs/:id` - Get all jobs for a user
- `GET /api/job/appliedJobs/:id` - Get all applied jobs
- `GET /api/job/getAllCandidate` - Get all candidates for a job

### **Appointments**
- `POST /api/appointment/create` - Create an appointment

### **FAQ AI Assistant**
- `POST /api/faq/answer` - AI extracts relevant information from responses

---

## Database Schema

### **Users Table**
```sql
CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    phoneno VARCHAR
);
```

### **Jobs Table**
```sql
CREATE TABLE job (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    company VARCHAR NOT NULL,
    description TEXT,
    requirements TEXT,
    clientId INTEGER REFERENCES client(id)
);
```

### **Candidates Table**
```sql
CREATE TABLE candidate (
    id SERIAL PRIMARY KEY,
    clientid INTEGER REFERENCES client(id),
    current_ctc VARCHAR,
    expected_ctc VARCHAR,
    notice_period VARCHAR
);
```

### **Appointments Table**
```sql
CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidate(id),
    job_id INTEGER REFERENCES job(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Features
- **User Authentication:** Secure login and registration with hashed passwords.
- **Job Management:** Clients can post, edit, and delete jobs.
- **Candidate Applications:** Candidates can apply for jobs.
- **Appointment Scheduling:** Prevents overlapping interview times.
- **AI-Powered FAQ Handling:** Extracts meaningful data from responses.
- **Speech-to-Text & Text-to-Speech:** Improves accessibility.

---

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Setup PostgreSQL and update `db.js` with credentials.
4. Run database migrations.
5. Start the backend:
   ```sh
   node server.js
   ```
6. Start the frontend:
   ```sh
   npm run dev
   ```

