require('dotenv').config();

const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

const session = require("express-session");
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day in msec
    resave: false
})); 

const carsController = require('./controllers/cars.route');
const rentsController = require('./controllers/rents.route');
const profilesController = require('./controllers/profiles.route');
const authController = require('./controllers/auth.route');

app.use('/static', express.static('static'));

app.use('/auth', authController);

app.use('/', (req, res, next) => {
    if(!req.session.user){
        res.redirect('/auth/login');
        return;
    }
    next();
});

app.use('*', (req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.infoMessage = req.session.infoMessage;
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    req.session.infoMessage = undefined;
    req.session.successMessage = undefined;
    req.session.errorMessage = undefined;
    next();
});

app.use('/cars', carsController);
app.use('/rents', rentsController);
app.use('/profiles', profilesController);

app.get('/', (req, res) => {
    res.redirect('/profiles/list');
});

app.get('/about', (req, res) => {
    res.render('about');
});


app.listen(port, () => {
    console.log(`Car Rental System app listening on port ${port}!`);
});
