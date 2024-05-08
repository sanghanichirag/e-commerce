const express = require('express');

const Routes = express.Router();

const ordercontroller = require('../Controllers/ordercontroller');

Routes.post('/Checkout', ordercontroller.checkOut);
Routes.get('/getAllOrdersDetails', ordercontroller.getAllOrdersDetails);
Routes.get('/getSingleOrdersDetails/:id', ordercontroller.getSingleOrdersDetails);

module.exports = Routes;