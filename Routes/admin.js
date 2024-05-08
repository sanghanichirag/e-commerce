const express = require('express');

const Routes = express.Router();

const admincontroller = require('../Controllers/admincontroller');

const AdminFetch = require('../Config/AdminFetch');

let Validater = require('../MiddleWare/Validate');
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

Routes.post('/login', ValidaterClass.LoginValidation(), validateHandler, admincontroller.Login);
Routes.post('/logout', AdminFetch, admincontroller.Log_Out);
Routes.get('/profiledetails', AdminFetch, admincontroller.getadminData);
Routes.post('/forgetPasswordEmail', admincontroller.forgetPasswordEmail);
Routes.post('/OtpVerification', admincontroller.OtpVerification);
Routes.post('/forgetpasswordMain', admincontroller.forgetpasswordMain);
Routes.post('/ChangePassword', AdminFetch, admincontroller.ChangePassword);
Routes.use('/product', AdminFetch, require('./Admin/Product'));
Routes.use('/order', AdminFetch, require('./Admin/Order'));

module.exports = Routes;