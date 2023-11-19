const express = require('express');

const router = express.Router();

router.get('/list', listAllCars)


async function listAllCars(req, res){
    const cars = [
        {car_brand: 'Audi', car_model: 'A4', car_year: 2},
        {car_brand: 'Audi', car_model: 'A5', car_year: 2},
        {car_brand: 'Audi', car_model: 'A6', car_year: 2},
    ]
    res.render("index", {cars: cars});
}

module.exports = router;