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
    },
        
    async createCar(car){
        let connection = await pool.getConnection();
        // boolean isManual = true/false is converted to 1/0
        car.isManual = car.isManual == 'true' ? 1 : 0;
        const sqlQuery = 'INSERT INTO Car (brand, model, isManual, passengers, energyType, doorsAmount, pricePerDay) VALUES (?, ?, ?, ?, ?, ?, ?)';
        let [rows] = await connection.execute(sqlQuery, [car.brand, car.model, car.isManual, car.passengers, car.energyType, car.doorsAmount, car.pricePerDay]);
        connection.release();
        return rows;
    },

    async editCar(id, car){
        let connection = await pool.getConnection();
        // boolean isManual = true/false is converted to 1/0
        car.isManual = car.isManual == 'true' ? 1 : 0;
        const sqlQuery = 'UPDATE Car SET brand=?, model=?, isManual=?, passengers=?, energyType=?, doorsAmount=?, pricePerDay=? WHERE carID=?';
        let [rows] = await connection.execute(sqlQuery, [car.brand, car.model, car.isManual, car.passengers, car.energyType, car.doorsAmount, car.pricePerDay, id]);
        connection.release();
        return rows;
    },

    async removeCar(id){
        let connection = await pool.getConnection();
        const sqlQuery = 'DELETE FROM Car WHERE carID=?';
        let [rows] = await connection.execute(sqlQuery, [id]);
        connection.release();
        return rows;
    }
    
}