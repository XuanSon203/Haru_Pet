const express = require('express');
const routes = express.Router();
const petCategory = require('../../controller/admin/PetCategory');
routes.get(`/`,petCategory.index);
routes.get(`/create`,petCategory.create);

module.exports = routes;