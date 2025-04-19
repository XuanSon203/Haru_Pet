const express = require("express");
const routes = express.Router();
const petController = require("../../controller/admin/PetController");
const multer = require("multer");
const uploadCloud = require("../../middleware/admin/uploadCloudMiddleware");
const upload = multer();
routes.get(`/`, petController.index);
routes.get("/create", petController.create);
routes.post(
  "/create",
  upload.single("image"),
  uploadCloud.upload,
  petController.createPost
);
routes.get("/edit/:id", petController.edit);
routes.patch(
  "/edit/:id",
  upload.single("image"),
  uploadCloud.upload,
  petController.editPatch
);
routes.delete("/delete/:id", petController.deleteItem);
routes.get("/:name", petController.search);
routes.patch("/change-status/:status/:id", petController.changeStatusItem);
routes.patch("/change-multi", petController.changeMulti);
module.exports = routes;
