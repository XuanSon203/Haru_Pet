const express = require("express");
const routes = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middleware/admin/uploadCloudMiddleware");
const upload = multer();
const petCategory = require("../../controller/admin/PetCategoryController");
const validate = require("../../validate/admin/products-categoryValidate");
routes.get(`/`, petCategory.index);
routes.get(`/create`, petCategory.create);
routes.post(
  `/create`,
  upload.single("image"),
  uploadCloud.upload,
  validate.createPost,
  petCategory.createPost
);
routes.get("/edit/:id", petCategory.edit);
routes.patch(
  "/edit/:id",
  upload.single("image"),
  uploadCloud.upload,
  validate.createPost,

  petCategory.editPatch
);
routes.patch("/change-status/:status/:id", petCategory.changeStatusItem);
routes.patch("/change-multi", petCategory.changeMulti);
routes.delete("/delete/:id", petCategory.deleteItem);
routes.get("/detail/:id",petCategory.detail);
module.exports = routes;
