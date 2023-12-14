const express = require('express');
const router = express.Router();
const carRepository = require('../utils/car.repostitory');
const rentsRepository = require('../utils/rents.repository');
const { adminRightsCheck } = require('../utils/middlewares');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/static/img/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/list', listAllCars);
router.get('/manage', adminRightsCheck, showCarManagement);
router.post('/create', adminRightsCheck, upload.single('image'), createCar);
router.get('/view/:carId', showCarById);
router.post('/edit/:carId', upload.single('image'), editCarById);
router.post('/delete/:carId', deleteCarById);

async function listAllCars(req, res) {
    try {
        const cars = await carRepository.getAllCars();
        res.render('cars/list', { cars: cars });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function showCarById(req, res) {
    try {
        const id = req.params.carId;
        const car = await carRepository.getCarById(id);
        const rents = await rentsRepository.getRentsByCarIdWithProfileInfos(id);
        console.log(car);
        res.render('cars/show', { car: car[0], rents: rents });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function showCarManagement(req, res) {
    try {
        const cars = await carRepository.getAllCars();
        res.render('cars/manage', { cars: cars });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function createCar(req, res) {
    try {
        console.log(req.body);
        // TODO: check if all fields are filled
        if (req.file) {
            console.log(req.file);
            req.body.image = `/static/img/${req.file.filename}`;
        } else {
            req.body.image = '';
        }
        await carRepository.createCar(req.body);
        res.redirect('/cars/manage');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function editCarById(req, res) {
    try {
        const id = req.params.carId;
        console.log(req.body);
        // TODO: check if all fields are filled
        if (req.file) {
            console.log(req.file);
            req.body.image = `/static/img/${req.file.filename}`;
        }
        await carRepository.editCar(id, req.body);
        res.redirect('/cars/manage');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function deleteCarById(req, res) {
    try {
        const id = req.params.carId;
        await carRepository.removeCar(id);
        res.redirect('/cars/manage');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = router;
