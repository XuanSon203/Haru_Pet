const express = require("express");
const routes = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middleware/admin/uploadCloudMiddleware");
const upload = multer();
const petCategory = require("../../controller/admin/PetCategoryController");
routes.get(`/`, petCategory.index);
routes.get(`/create`, petCategory.create);
routes.post(
  `/create`,
  upload.single("image"),
  uploadCloud.upload,
  petCategory.createPost
);
routes.get("/edit/:id", petCategory.edit);
routes.patch(
  "/edit/:id",
  upload.single("image"),
  uploadCloud.upload,
  petCategory.editPatch
);
routes.patch("/change-status/:status/:id", petCategory.changeStatusItem);
routes.patch("/change-multi", petCategory.changeMulti);
routes.delete("/delete/:id", petCategory.deleteItem);

module.exports = routes;
