const express = require('express');

const router = express.Router();

const profileRepository = require('../utils/profiles.repository');

router.get('/login', showLogin);
router.post('/login', loginUser);

router.get('/register', showRegister);
router.post('/register', registerUser);

router.get('/logout', logoutUser);


async function showLogin(req, res){
    console.log(req.session);
    if(req.session.user){
        res.redirect('/profiles/list');
        return;
    }
    res.render("auth/login");
}

async function showRegister(req, res){
    res.render("auth/register");
}

async function loginUser(req, res){
    console.log(req.body);
    // Check if all fields are filled
    if(!req.body.username || !req.body.password){
        res.send("Please fill all fields");
        return;
    }

    // Check if username exists
    const usernameExists = await profileRepository.getProfileByUsername(req.body.username);
    if(usernameExists.length == 0){
        res.send("Username doesn't exist");
        return;
    }
    
    if(usernameExists.length > 1){
        // in case of multiple users with the same username (should never happen)
        res.send("Unexpected error");
        return;
    }

    // Check if password is correct
    const correctPassword = await profileRepository.comparePassword(req.body.password, usernameExists[0].passwordHash);
    if(!correctPassword){
        res.send("Incorrect password");
        return;
    }

    req.session.regenerate(function (err) {
        if (err) next(err)
    
        // store user information in session, typically a user id
        // Set session
        req.session.user = usernameExists[0];
    
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err)
          res.redirect('/profiles/list');
        })
      })
}

async function logoutUser(req, res){
    // logout logic

    req.session.user = null
    req.session.save(function (err) {
        if (err) next(err)

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/auth/login')
        })
    })
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