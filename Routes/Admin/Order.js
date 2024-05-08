const express = require('express');

const Routes = express.Router();

const ordercontroller = require('../../Controllers/Admin/ordercontroller');

Routes.get('/getAllOrdersDetails', ordercontroller.getAllOrdersDetails);
Routes.get('/getSingleUserOrdersDetails/:id', ordercontroller.getSingleUserOrdersDetails);
Routes.post('/UpdateOrderStatus', ordercontroller.UpdateOrderStatus);

module.exports = Routes;