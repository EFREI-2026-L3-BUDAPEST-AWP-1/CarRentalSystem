const pool = require('./db');

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    async getAllProfiles() {
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Profile';
        let [rows] = await connection.execute(sqlQuery);
        connection.release();
        return rows;
    },
    async getProfileById(id) {
        if (!id) {
            throw new Error('Invalid input: id is required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Profile WHERE profileID =?';
        let [rows] = await connection.execute(sqlQuery, [id]);
        connection.release();
        return rows;
    },
    async getProfileByUsername(username) {
        if (!username) {
            throw new Error('Invalid input: username is required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Profile WHERE login =?';
        let [rows] = await connection.execute(sqlQuery, [username]);
        connection.release();
        return rows;
    },
    async comparePassword(password, passwordHash) {
        if (!password || !passwordHash) {
            throw new Error('Invalid input: password and passwordHash are required');
        }
        return await bcrypt.compare(password, passwordHash);
    },
    async addProfile(newUser) {
        if (!newUser || !newUser.login || !newUser.password || !newUser.firstname || !newUser.lastname) {
            throw new Error('Invalid input: newUser object with login, password, firstname, and lastname is required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'INSERT INTO Profile (login, passwordHash, firstName, lastName, isAdmin) VALUES (?, ?, ?, ?, 0)';
        bcrypt.hash(newUser.password, saltRounds, async function (err, hash) {
            if (err) throw err;
            let [rows] = await connection.execute(sqlQuery, [newUser.login, hash, newUser.firstname, newUser.lastname]);
            connection.release();
            return rows;
        });
    }
}
