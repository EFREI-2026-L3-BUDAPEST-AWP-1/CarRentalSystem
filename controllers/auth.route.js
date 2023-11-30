const express = require('express');

const router = express.Router();

const profileRepository = require('../utils/profiles.repository');

router.get('/login', showLogin);
router.get('/register', showRegister);
router.post('/register', registerUser);


async function showLogin(req, res){
    res.render("auth/login");
}

async function showRegister(req, res){
    res.render("auth/register");
}

async function registerUser(req, res){
    console.log(req.body);
    // Check if all fields are filled
    if(!req.body.username || !req.body.password || !req.body.passwordCheck || !req.body.firstname || !req.body.lastname){
        res.send("Please fill all fields");
        return;
    }

    // Check if passwords match
    if(req.body.password != req.body.passwordCheck){
        res.send("Passwords don't match");
        return;
    }

    // Check if username is taken
    const usernameExists = await profileRepository.getProfileByUsername(req.body.username);
    if(usernameExists.length > 0){
        res.send("Username already exists");
        return;
    }

    // Create new user
    const newUser = {
        login: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    await profileRepository.addProfile(newUser);
    res.send("ok");
}

module.exports = router;