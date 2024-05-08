const express = require('express');

const Routes = express.Router();

const addtocartcontroller = require('../Controllers/addtocartcontroller');

Routes.post('/Add', addtocartcontroller.Add);
Routes.get('/GetAll', addtocartcontroller.GetAll);
Routes.delete('/Delete/:id', addtocartcontroller.Delete);
Routes.post('/update', addtocartcontroller.update);

module.exports = Routes;