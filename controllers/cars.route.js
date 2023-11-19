const express = require('express');

const router = express.Router();

const carRepository = require('../utils/car.repostitory');

router.get('/list', listAllCars)
router.get('/:carId', showCarById)


async function listAllCars(req, res){
    const cars = await carRepository.getAllCars();
    console.log(cars);
    res.render("index", {cars: cars});
    //res.send("Hello")
}

async function showCarById(req, res){
    const id = req.params.carId;
    const car = await carRepository.getCarById(id);
    console.log(car);
    res.render("cars/show", {car: car[0]});
}

module.exports = router;