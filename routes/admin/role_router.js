const express = require('express');
const routes = express.Router();
const roleController = require('../../controller/admin/RoleController');
routes.get(`/`,roleController.index);
routes.get(`/create`,roleController.create);
routes.post(`/create`,roleController.createPost);
routes.get(`/edit/:id`,roleController.edit);
routes.patch(`/edit/:id`,roleController.editPatch);
routes.delete("/delete/:id",roleController.deleteItem);
routes.get("/permissions", roleController.permissions);
routes.patch("/permissions", roleController.permissionsPatch);

module.exports = routes;