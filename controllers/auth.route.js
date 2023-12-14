const express = require('express');
const router = express.Router();
const profileRepository = require('../utils/profiles.repository');

router.get('/login', showLogin);
router.post('/login', loginUser);
router.get('/register', showRegister);
router.post('/register', registerUser);
router.get('/logout', logoutUser);

async function showLogin(req, res) {
    if (req.session.user) {
        res.redirect('/profiles/list');
        return;
    }
    res.render('auth/login');
}

async function showRegister(req, res) {
    res.render('auth/register');
}

async function loginUser(req, res) {
    console.log(req.body);
    // Check if all fields are filled
    if (!req.body.username || !req.body.password) {
        req.session.errorMessage = 'Please fill all fields';
        res.redirect('/auth/login');
        return;
    }

    // Check if username exists
    const usernameExists = await profileRepository.getProfileByUsername(req.body.username);
    if (usernameExists.length === 0) {
        req.session.errorMessage = "Username doesn't exist";
        res.redirect('/auth/login');
        return;
    }

    if (usernameExists.length > 1) {
        // in case of multiple users with the same username (should never happen)
        req.session.errorMessage = 'Multiple users with the same username';
        res.redirect('/auth/login');
        return;
    }

    // Check if password is correct
    const correctPassword = await profileRepository.comparePassword(req.body.password, usernameExists[0].passwordHash);
    if (!correctPassword) {
        req.session.errorMessage = 'Password is incorrect';
        res.redirect('/auth/login');
        return;
    }

    req.session.regenerate(function (err) {
        if (err) next(err);

        // store user information in session, typically a user id
        // Set session
        req.session.user = usernameExists[0];

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
            if (err) return next(err);
            res.redirect('/profiles/list');
        });
    });
}

async function logoutUser(req, res) {
    // logout logic

    req.session.user = null;
    req.session.save(function (err) {
        if (err) next(err);

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err) next(err);
            // Update info message
            req.session.infoMessage = 'You have been logged out';
            res.redirect('/auth/login');
        });
    });
}

async function registerUser(req, res) {
    console.log(req.body);
    // Check if all fields are filled
    if (!req.body.username || !req.body.password || !req.body.passwordCheck || !req.body.firstname || !req.body.lastname) {
        req.session.errorMessage = 'Please fill all fields';
        res.redirect('/auth/register');
        return;
    }

    // Check if passwords match
    if (req.body.password !== req.body.passwordCheck) {
        req.session.errorMessage = "Passwords don't match";
        res.redirect('/auth/register');
        return;
    }

    // Check if username is taken
    const usernameExists = await profileRepository.getProfileByUsername(req.body.username);
    if (usernameExists.length > 0) {
        req.session.errorMessage = 'Username is already taken';
        res.redirect('/auth/register');
        return;
    }

    // Create new user
    const newUser = {
        login: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };
    await profileRepository.addProfile(newUser);
    req.session.infoMessage = 'You have been registered. Please log in';
    res.redirect('/auth/login');
}

module.exports = router;
