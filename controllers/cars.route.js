const express = require('express');

const router = express.Router();

const carRepository = require('../utils/car.repostitory');
const rentsRepository = require('../utils/rents.repository');

router.get('/list', listAllCars);
router.get('/manage', showCarManagement);
router.post('/create', createCar);
router.get('/view/:carId', showCarById);
router.post('/edit/:carId', editCarById);
router.post('/delete/:carId', deleteCarById);


async function listAllCars(req, res){
    const cars = await carRepository.getAllCars();
    res.render("cars/list", {cars: cars});
}

async function showCarById(req, res){
    const id = req.params.carId;
    const car = await carRepository.getCarById(id);
    const rents = await rentsRepository.getRentsByCarIdWithProfileInfos(id);
    console.log(car);
    res.render("cars/show", {car: car[0], rents: rents});
}

async function showCarManagement(req, res){
    const cars = await carRepository.getAllCars();
    res.render("cars/manage", {cars: cars});
}

async function createCar(req, res){
    console.log(req.body);
    carRepository.createCar(req.body);
    res.redirect("/cars/manage");
}

async function editCarById(req, res){
    const id = req.params.carId;
    console.log(req.body);
    carRepository.editCar(id, req.body);
    res.redirect("/cars/manage");
}

async function deleteCarById(req, res){
    const id = req.params.carId;
    carRepository.removeCar(id);
    res.redirect("/cars/manage");
}

module.exports = router;