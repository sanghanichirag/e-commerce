const express = require('express');

const Routes = express.Router();

const productcontroller = require('../Controllers/Admin/productcontroller');

Routes.use('/admin', require('./admin'));
Routes.use('/user', require('./user'));
Routes.use('/product/all', productcontroller.GetAll);

module.exports = Routes;