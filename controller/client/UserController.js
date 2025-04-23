const User = require("../../model/UserModel");
const md5 = require("md5");
const generateHelper = require("../../helper/generate");
const Cart = require("../../model/CartModel");
module.exports.register = async (req, res) => {
  res.render("client/pages/users/register");
};
module.exports.registerPost = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const exitsEmail = await User.findOne({
    email: email,
    deleted: false,
  });
  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại ");
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};
module.exports.login = async (req, res) => {
  res.render("client/pages/users/login");
};
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại ");
    res.redirect("back");
    return;
  }
  if (password != user.password) {
    req.flash("error", "Sai mật khẩu  ");
    res.redirect("back");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản này đang bị khóa   ");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  // Lưu user_id vào cart

  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user.id,
    }
  );
  res.redirect("/");
};
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/");
};
