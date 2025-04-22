const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard_router");
const petRouter = require('./pet_router');
const petCategory = require('./pets-category_router');
const accountRouter = require('./account_router');
const roleRouter = require('./role_router');
const authRouter = require('./auth_router');
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(`${PATH_ADMIN}`, dashboardRouter);
  app.use(`${PATH_ADMIN}/pets`, petRouter);
  app.use(`${PATH_ADMIN}/pets-category`, petCategory);
  app.use(`${PATH_ADMIN}/accounts`, accountRouter);
  app.use(`${PATH_ADMIN}/roles`, roleRouter);
  app.use(`${PATH_ADMIN}/auth`, authRouter);
};
