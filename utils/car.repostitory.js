const pool = require('./db');

module.exports = {
    async getAllCars(){
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Car';
        let [rows] = await connection.execute(sqlQuery);
        connection.release();
        return rows;
    },
    async getCarById(id){
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Car WHERE carID =?';
        let [rows] = await connection.execute(sqlQuery, [id]);
        connection.release();
        return rows;
    }
    
}