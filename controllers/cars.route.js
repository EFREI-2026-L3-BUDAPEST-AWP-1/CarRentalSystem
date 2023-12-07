const express = require('express');

const router = express.Router();

const carRepository = require('../utils/car.repostitory');
const rentsRepository = require('../utils/rents.repository');

// Manage car images upload
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.cwd() + '/static/img/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  })
  
const upload = multer({ storage: storage})

router.get('/list', listAllCars);
router.get('/manage', showCarManagement);
router.post('/create', upload.single('image'), createCar);
router.get('/view/:carId', showCarById);
router.post('/edit/:carId', upload.single('image'), editCarById);
router.post('/delete/:carId', deleteCarById);


async function listAllCars(req, res){
    const cars = await carRepository.getAllCars();
    res.render("cars/list", {cars: cars});
}

async function showCarById(req, res){
    const id = req.params.carId;
    const car = await carRepository.getCarById(id);
    const rents = await rentsRepository.getRentsByCarIdWithProfileInfos(id);
    console.log(car);
    res.render("cars/show", {car: car[0], rents: rents});
}

async function showCarManagement(req, res){
    const cars = await carRepository.getAllCars();
    res.render("cars/manage", {cars: cars});
}

async function createCar(req, res){
    console.log(req.body);
    // TODO : check if all fields are filled
    if(req.file){
        console.log(req.file);
        req.body.image = `/static/img/${req.file.filename}`;
    } else {
        req.body.image = "";
    }
    carRepository.createCar(req.body);
    res.redirect("/cars/manage");
}

async function editCarById(req, res){
    const id = req.params.carId;
    console.log(req.body);
    // TODO : check if all fields are filled
    if(req.file){
        console.log(req.file);
        req.body.image = `/static/img/${req.file.filename}`;
    }
    carRepository.editCar(id, req.body);
    res.redirect("/cars/manage");
}

async function deleteCarById(req, res){
    const id = req.params.carId;
    carRepository.removeCar(id);
    res.redirect("/cars/manage");
}

module.exports = router;