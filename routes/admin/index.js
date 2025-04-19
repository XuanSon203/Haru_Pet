const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard_router");
const petRouter = require('./pet_router');
const petCategory = require('./pets-category_router');
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(`${PATH_ADMIN}`, dashboardRouter);
  app.use(`${PATH_ADMIN}/pets`, petRouter);
  app.use(`${PATH_ADMIN}/pets-category`, petCategory);
};
