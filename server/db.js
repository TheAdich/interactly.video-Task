const {Pool} = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool=new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    idleTimeoutMillis: 30000,
})

const connectDB=async()=>{
    try {
        await pool.connect();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
}



module.exports={pool, connectDB};

