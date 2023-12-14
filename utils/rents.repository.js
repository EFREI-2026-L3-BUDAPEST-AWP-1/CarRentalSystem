const pool = require('./db');

module.exports = {
    async getAllRents() {
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent';
        let [rows] = await connection.execute(sqlQuery);
        connection.release();
        return rows;
    },
    async getAllRentsWithCarAndProfileInfos() {
        // use JOINS to get the profile information of the renter, the car information and the rent information
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent JOIN Profile ON Rent.profileID = Profile.profileID JOIN Car ON Rent.carID = Car.carID';
        let [rows] = await connection.execute(sqlQuery);
        connection.release();
        return rows;
    },
    async getRentById(id) {
        if (!id) {
            throw new Error('Rent ID is required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent WHERE rentID = ?';
        let [rows] = await connection.execute(sqlQuery, [id]);
        connection.release();
        return rows;
    },
    async getRentByIdWithCarAndProfileInfos(id) {
        // use JOINS to get the profile information of the renter, the car information and the rent information
        if (!id) {
            throw new Error('Rent ID is required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent JOIN Profile ON Rent.profileID = Profile.profileID JOIN Car ON Rent.carID = Car.carID WHERE Rent.rentID = ?';
        let [rows] = await connection.execute(sqlQuery, [id]);
        connection.release();
        return rows;
    },
    async getRentsByCarIdWithProfileInfos(carId) {
        // use JOINS to get the profile information of the renter, the car information and the rent information
        if (!carId) {
            throw new Error('Car ID is required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent JOIN Profile ON Rent.profileID = Profile.profileID JOIN Car ON Rent.carID = Car.carID WHERE Rent.carID = ?';
        let [rows] = await connection.execute(sqlQuery, [carId]);
        connection.release();
        return rows;
    },
    async getRentsByProfileId(profileId) {
        if (!profileId) {
            throw new Error('Profile ID is required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'SELECT * FROM Rent WHERE profileID = ?';
        let [rows] = await connection.execute(sqlQuery, [profileId]);
        connection.release();
        return rows;
    },

    async createRentForCar(carId, profileId, infos) {
        if (!carId || !profileId || !infos || !infos.tookDate || !infos.dueDate || !infos.totalPrice) {
            throw new Error('Invalid input');
        }
        const { tookDate, dueDate } = infos;
        const price = infos.totalPrice;
        let connection = await pool.getConnection();
        const sqlQuery = 'INSERT INTO Rent (carID, profileID, tookDate, dueDate, price) VALUES (?, ?, ?, ?, ?)';
        let [rows] = await connection.execute(sqlQuery, [carId, profileId, tookDate, dueDate, price]);
        return rows;
    },

    async returnCar(rentId, returnedDate) {
        if (!rentId || !returnedDate) {
            throw new Error('Rent ID and returned date are required');
        }
        let connection = await pool.getConnection();
        const sqlQuery = 'UPDATE Rent SET returnedDate = ? WHERE rentID = ?';
        let [rows] = await connection.execute(sqlQuery, [returnedDate, rentId]);
        connection.release();
        return rows;
    }
}
