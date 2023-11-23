const express = require('express');

const router = express.Router();

const rentsRepository = require('../utils/rents.repository');

router.get('/list', listAllRents)
router.get('/:rentId', showRentById)

async function listAllRents(req, res){
    const rents = await rentsRepository.getAllRents();
    console.log(rents);
    res.render("rents/list", {rents});
}

async function showRentById(req, res){
    const id = req.params.rentId;
    const rent = await rentsRepository.getRentById(id);
    console.log(rent);
    res.render("rents/show", {rent: rent[0]});
}

module.exports = router;