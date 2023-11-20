const pool = require('./db');

module.exports = {
    async getAllRents(){
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent';
        let [rows] = await connection.execute(sqlQuery);
        connection.release();
        return rows;
    },
    async getRentById(id){
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent WHERE rentID =?';
        let [rows] = await connection.execute(sqlQuery, [id]);
        connection.release();
        return rows;
    }
}