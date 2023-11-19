const pool = require('./db');

module.exports = {
    async getAllRents(){
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent';
        let [rows] = await connection.execute(sqlQuery);
        connection.release();
        return rows;
    },
}