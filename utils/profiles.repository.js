const pool = require('./db');

module.exports = {
    async getAllProfiles(){
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Profile';
        let [rows] = await connection.execute(sqlQuery);
        connection.release();
        return rows;
    },
    async getProfileById(id){
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Profile WHERE profileID =?';
        let [rows] = await connection.execute(sqlQuery, [id]);
        connection.release();
        return rows;
    }
    
}