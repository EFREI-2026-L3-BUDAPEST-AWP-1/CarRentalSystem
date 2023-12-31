const express = require('express');

const router = express.Router();

const rentsRepository = require('../utils/rents.repository');
const carRepository = require('../utils/car.repostitory');
const { adminRightsCheck } = require('../utils/middlewares');

router.get('/list', adminRightsCheck, listAllRents);
router.post('/create/:carId', showRentCreation);
router.post('/return/:rentId', returnCar);
router.get('/my', showCurrentUserRents);
router.get('/:rentId', showRentById);

async function listAllRents(req, res) {
    try {
        const rents = await rentsRepository.getAllRentsWithCarAndProfileInfos();
        console.log(rents);
        res.render("rents/list", { rents });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

async function showRentById(req, res) {
    try {
        const id = req.params.rentId;
        const rent = await rentsRepository.getRentByIdWithCarAndProfileInfos(id);
        console.log(rent);
        console.log(res.locals);
        res.render("rents/show", { rent: rent[0] });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

async function showRentCreation(req, res) {
    try {
        const carId = req.params.carId;
        const rents = await rentsRepository.getRentsByCarIdWithProfileInfos(carId);
        const car = await carRepository.getCarById(carId);
    // TODO: check if car is available

        if (!req.body.tookDate || !req.body.dueDate) {
            res.redirect("/cars/view/" + carId);
            return;
        }

        // count days (same date is 1 day)
        const tookDate = new Date(req.body.tookDate);
        const dueDate = new Date(req.body.dueDate);
        const totalDays = Math.ceil((dueDate - tookDate) / (1000 * 60 * 60 * 24)) + 1;
        const totalPrice = totalDays * car[0].pricePerDay;
        console.log(totalDays, totalPrice);

        if (req.body.confirmRent) {
            const infos = {
                tookDate: req.body.tookDate,
                dueDate: req.body.dueDate,
                totalPrice: totalPrice,
            };
            console.log(infos);
            const result = await rentsRepository.createRentForCar(
                carId,
                req.session.user.profileID,
                infos,
            );
            // redirect to inserted rent id
            req.session.successMessage = "Rent created successfully! Enjoy your ride!";
            res.redirect("/rents/" + result.insertId);
            return;
        } else {
            res.render("rents/create", {
                rents,
                car: car[0],
                tookDate: req.body.tookDate,
                dueDate: req.body.dueDate,
                totalPrice,
                totalDays,
            });
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

async function returnCar(req, res) {
    try {
        const id = req.params.rentId;
        const returnDate = new Date();
    // format for mysql
        const returnDateFormatted = returnDate
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const result = await rentsRepository.returnCar(id, returnDateFormatted);
        console.log(result);
        if (result.affectedRows == 1) {
            req.session.successMessage =
                "Car returned successfully! Thank you for using our services!";
        } else {
            req.session.errorMessage = "Error while returning car!";
        }
        res.redirect("/rents/" + id);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

async function showCurrentUserRents(req, res){
    const rents = await rentsRepository.getRentsByProfileIdWithCarInfos(req.session.user.profileID);
    res.render("rents/current_user_rents", {rents});
}

module.exports = router;
