require('dotenv').config();

const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3000;

const carsController = require('./controllers/cars.route');
const rentsController = require('./controllers/rents.route');
const profilesController = require('./controllers/profiles.route');

app.use('/static', express.static('static'));

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
