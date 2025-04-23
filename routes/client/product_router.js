const express = require("express");
const routes = express.Router();
const productController = require("../../controller/client/ProductController");
routes.get(`/`, productController.index);
routes.get("/:slug", productController.detail);

module.exports = routes;
