const express = require('express');
const routes = express.Router();
const homeController = require('../../controller/client/HomeController');
routes.get(`/`,homeController.index);
module.exports = routes;