const express = require('express');

const router = express.Router();

const rentsRepository = require('../utils/rents.repository');

router.get('/list', listAllRents)

async function listAllRents(req, res){
    const rents = await rentsRepository.getAllRents();
    console.log(rents);
    res.render("rents/list", {rents});
}


module.exports = router;