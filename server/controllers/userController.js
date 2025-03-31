const { pool } = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const registerUser = async (req, res) => {
    try {
        const { username, email, password, phoneno, role } = req.body;

        const userNameUniqueCheck = `SELECT * FROM client WHERE username=$1`;
        const isSameUserNameExists = await pool.query(userNameUniqueCheck, [username]);
        if (isSameUserNameExists.rowCount > 0) {
            return res.status(401).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO client (username,email,password,role,phoneno)
        VALUES 
        ($1,$2,$3,$4,$5) RETURNING username,role,id`;
        const values = [username, email, hashedPassword, role, phoneno];
        await pool.query('BEGIN');
        const result = await pool.query(query, values);
        const user = result.rows[0];
        //console.log(user);
        const token = jwt.sign({ username: user.username, role: user.role, id:user.id }, process.env.JWT_SECRET);
        await pool.query('COMMIT');
        return res.status(201).json({ user, token });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.log(err);
        return res.status(400).json({ message: 'Error registering user' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = `SELECT * FROM client WHERE username=$1`;
        const isUserExists = await pool.query(query, [username]);
        if (isUserExists.rowCount === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = isUserExists.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET);
        return res.status(200).json({ user: { username: user.username, role: user.role, id:user.id }, token });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error logging in user' });

    }
}

module.exports = { registerUser, loginUser }