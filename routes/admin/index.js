const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard_router");
const petRouter = require("./pet_router");
const petCategory = require("./pets-category_router");
const accountRouter = require("./account_router");
const roleRouter = require("./role_router");
const authRouter = require("./auth_router");
const myAccountRouter = require("./my-account");
const authMiddleware = require("../../middleware/admin/autMiddleware");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(`${PATH_ADMIN}/auth`, authRouter);
  app.use(`${PATH_ADMIN}`, authMiddleware.requireAuth, dashboardRouter);
  app.use(`${PATH_ADMIN}/pets`, authMiddleware.requireAuth, petRouter);
  app.use(
    `${PATH_ADMIN}/pets-category`,
    authMiddleware.requireAuth,
    petCategory
  );
  app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountRouter);
  app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, roleRouter);
  app.use(
    `${PATH_ADMIN}/my-account`,
    authMiddleware.requireAuth,
    myAccountRouter
  );
};
