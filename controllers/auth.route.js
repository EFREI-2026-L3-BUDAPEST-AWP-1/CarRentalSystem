const express = require('express');

const router = express.Router();

router.get('/login', showLogin);


async function showLogin(req, res){
    res.render("auth/login");
}

module.exports = router;