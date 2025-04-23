const home = require("./home_router");
const product = require("./product_router");
const cart = require("./cart_router");
const cartMiddleware = require("../../middleware/client/cartmiddleware");
const userMiddleware = require("../../middleware/client/usemiddleware");

const user = require("./user_router");
module.exports = (app) => {
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use("/", home);
  app.use("/products", product);
  app.use("/cart", cart);
  app.use("/user", user);
};
