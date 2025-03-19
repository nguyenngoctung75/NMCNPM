const connection = require('../config/db');


const getUserById = async (userId) => {
    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        return rows[0];
    } catch (error) {
        throw new Error('Error getting user by id: ' + error.message);
    }
};

const getUserByEmail = async (email) => {
    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        return rows[0];
    } catch (error) {
        throw new Error('Error getting user by email: ' + error.message);
    }
};



const getAllUsers = async () => {
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
};

const createUser = async (user) => {
    const { name, email, password} = user;
    const [result] = await connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    return result.insertId;
};

const updateUser = async (userId, user) => {
    const { name, email, password } = user;
    await connection.query('UPDATE users SET name = ?, email = ?, password = ? WHERE user_id = ?', [name, email, password, userId]);
};

const deleteUser = async (userId) => {
    await connection.query('DELETE FROM users WHERE user_id = ?', [userId]);
};

module.exports = {
    getUserById,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
};
