const express = require('express');
const router = express.Router();
const carRepository = require('../utils/car.repostitory');
const rentsRepository = require('../utils/rents.repository');
const { adminRightsCheck } = require('../utils/middlewares');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${process.cwd()}/static/img`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  })
  
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept images only
        // In the future, we can add a check to see if the image is a real image and not a fake extension
        if(file.mimetype.startsWith('image/')){
            cb(null, true);
        }
        else{
            cb(new Error('The uploaded file is not an image!'), false);
        }
    },
})

async function fileCheck(req, res, next){
    upload.single('image')(req, res, function(err){
        if(err){
            req.session.errorMessage = err.message;
            res.redirect('/cars/manage');
        }
        else{
            next();
        }
    
    });
}

router.get('/list', listAllCars);
router.get('/manage', adminRightsCheck, showCarManagement);
router.post('/create', adminRightsCheck, fileCheck, createCar);
router.post('/edit/:carId', adminRightsCheck, fileCheck, editCarById);
router.post('/delete/:carId', adminRightsCheck, deleteCarById);
router.get('/view/:carId', showCarById);


async function listAllCars(req, res){
    // check query: transmission=&passengers=&energyType=1 if types are ok
    console.log(req.query);
    if(req.query.transmission && (req.query.transmission != 'true' && req.query.transmission != 'false')){
        req.session.errorMessage = "Invalid transmission type";
        res.redirect("/cars/list");
        return;
    }
    if(req.query.passengers && (req.query.passengers != '2' && req.query.passengers != '3' && req.query.passengers != '4' && req.query.passengers != '5' && req.query.passengers != '6' && req.query.passengers != '7')){
        req.session.errorMessage = "Invalid passengers type";
        res.redirect("/cars/list");
        return;
    }
    if(req.query.energyType && (req.query.energyType != '1' && req.query.energyType != '2' && req.query.energyType != '3' && req.query.energyType != '4')){
        req.session.errorMessage = "Invalid energy type";
        res.redirect("/cars/list");
        return;
    }
    let params = {
        passengers: parseInt(req.query.passengers),
        energyType: parseInt(req.query.energyType)
    }
    if(req.query.transmission){
        params.isManual = req.query.transmission == 'true' ? 1 : 0;
        console.log(params.isManual);
    }
    const cars = await carRepository.filterCars(params);
    res.render("cars/list", {cars: cars, params: params});
}

async function showCarById(req, res){
    if(!req.params.carId){
        req.session.errorMessage = "No car id";
        res.redirect("/cars/list");
        return;
    }
    const id = req.params.carId;
    const car = await carRepository.getCarById(id);
    const rents = await rentsRepository.getRentsByCarIdWithProfileInfos(id);
    console.log(car);
    res.render("cars/show", {car: car[0], rents: rents});
}

async function showCarManagement(req, res) {
    try {
        const cars = await carRepository.getAllCars();
        res.render('cars/manage', { cars: cars });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function createCar(req, res){
    console.log(req.body);

    if(!req.body.brand || !req.body.model || !req.body.carDescription || !req.body.isManual || !req.body.passengers || !req.body.energyType || !req.body.doorsAmount || !req.body.pricePerDay){
        req.session.errorMessage = "Please fill all fields";
        res.redirect('/cars/manage');
        return;
    }

    if(req.file){
        console.log(req.file);
        req.body.image = `/static/img/${req.file.filename}`;
    } else {
        req.body.image = "";
    }
    await carRepository.createCar(req.body);
    req.session.successMessage = `${req.body.brand} ${req.body.model} created successfully!`;
    res.redirect("/cars/manage");
}

async function editCarById(req, res){
    const id = req.params.carId;
    console.log(req.body);

    if(!req.body.brand || !req.body.model || !req.body.carDescription || !req.body.isManual || !req.body.passengers || !req.body.energyType || !req.body.doorsAmount || !req.body.pricePerDay){
        req.session.errorMessage = "Please fill all fields";
        res.redirect('/cars/manage');
        return;
    }

    if(req.file){
        console.log(req.file);
        req.body.image = `/static/img/${req.file.filename}`;
    }
    await carRepository.editCar(id, req.body);
    req.session.successMessage = `${req.body.brand} ${req.body.model} edited successfully!`;
    res.redirect("/cars/manage");
}

async function deleteCarById(req, res){
    if(!req.params.carId){
        req.session.errorMessage = "No car id";
        res.redirect("/cars/manage");
        return;
    }
    const id = req.params.carId;
    carRepository.removeCar(id);
    res.redirect("/cars/manage");
}

module.exports = router;
