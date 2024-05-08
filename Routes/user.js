const express = require('express');

const Routes = express.Router();

const usercontroller = require('../Controllers/usercontroller');

const UserFetch = require('../Config/UserFetch');

const path = require('path');

let Validater = require('../MiddleWare/Validate');

const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('./assets/Images/User'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

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

Routes.post('/register', ValidaterClass.UserRegisterValidation(), validateHandler, usercontroller.register);
Routes.post('/login', ValidaterClass.LoginValidation(), validateHandler, usercontroller.Login);
Routes.get('/GetUserProfile', UserFetch, usercontroller.GetUserProfile);
Routes.post('/UserProfileUpdate', upload.single('image'), ValidaterClass.ProfileValidation(), validateHandler, UserFetch, usercontroller.UserProfileUpdate);
Routes.post('/forgetPasswordEmail', usercontroller.forgetPasswordEmail);
Routes.post('/OtpVerification', usercontroller.OtpVerification);
Routes.post('/forgetpasswordMain', usercontroller.forgetpasswordMain);
Routes.post('/ChangePassword', UserFetch, usercontroller.ChangePassword);
Routes.post('/Logout', UserFetch, usercontroller.Log_Out);

Routes.use('/AddToCart', UserFetch, require('./addtocart'));
Routes.use('/Order', UserFetch, require('./order'));

module.exports = Routes;