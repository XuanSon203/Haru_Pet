const express = require("express");
const routes = express.Router();
const cartController = require("../../controller/client/CartController");
routes.get(`/`, cartController.index);
routes.get("/delete/:productId", cartController.deleteItem);
routes.post("/add/:productId", cartController.add);
routes.get("/update/:productId/:quantity", cartController.updateQuantity);
module.exports = routes;
