const express = require("express");
const routes = express.Router();
const accountController = require("../../controller/admin/AccountController");
const multer = require("multer");
const uploadCloud = require("../../middleware/admin/uploadCloudMiddleware");
const validate = require("../../validate/admin/accountValidate");

const upload = multer();
routes.get(`/`, accountController.index);
routes.get(`/create`, accountController.create);
routes.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  accountController.createPost
);
routes.get(`/edit/:id`, accountController.edit);
routes.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  accountController.editPatch
);
routes.delete("/delete/:id", accountController.deleteItem);
module.exports = routes;
