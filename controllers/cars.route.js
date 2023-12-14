const express = require('express');

const router = express.Router();

const carRepository = require('../utils/car.repostitory');
const rentsRepository = require('../utils/rents.repository');

const { adminRightsCheck } = require('../utils/middlewares');

// Manage car images upload
const multer  = require('multer')

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
    await carRepository.createCar(req.body);
    req.session.successMessage = `${req.body.brand} ${req.body.model} created successfully!`;
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
    await carRepository.editCar(id, req.body);
    req.session.successMessage = `${req.body.brand} ${req.body.model} edited successfully!`;
    res.redirect("/cars/manage");
}

async function deleteCarById(req, res){
    const id = req.params.carId;
    carRepository.removeCar(id);
    res.redirect("/cars/manage");
}

module.exports = router;