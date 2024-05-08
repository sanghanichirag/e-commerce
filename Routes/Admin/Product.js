const express = require('express');

const Routes = express.Router();

const productcontroller = require('../../Controllers/Admin/productcontroller');
const path = require('path');

const multer = require('multer');

let Validater = require('../../MiddleWare/Validate');
const { validationResult } = require('express-validator');
let ValidaterClass = new Validater();

function validateHandler(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({
            message: errors.errors[0].msg,
            success: false,
            data: {},
            status: 200
        });
    } else {
        next();
    }
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('./assets/Images/Product'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

Routes.post('/Add', upload.array('images'), ValidaterClass.ProductValidation(), validateHandler, productcontroller.Add);
Routes.get('/GetAll', productcontroller.GetAll);
Routes.get('/GetSingle/:id', productcontroller.GetSingle);
Routes.delete('/delete/:id', productcontroller.delete);
Routes.post('/update', upload.array('images'), ValidaterClass.ProductValidation(), validateHandler, productcontroller.update);

module.exports = Routes;