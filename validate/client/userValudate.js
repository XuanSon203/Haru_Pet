module.exports.registerPost = (req, res, next) => {
  // Kiểm tra nếu không có tiêu đề
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng không để trống.");
    return res.redirect("back");
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng không để trống.");
    return res.redirect("back");
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng không để trống.");
    return res.redirect("back");
  }
  next();
};
module.exports.loginPost = (req, res, next) => {

  if (!req.body.email) {
    req.flash("error", "Email không để trống.");
    return res.redirect("back");
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu .");
    return res.redirect("back");
  }
  next();
};
module.exports.forgotPassword = (req, res, next) => {

  if (!req.body.email) {
    req.flash("error", "Email không để trống.");
    return res.redirect("back");
  }
 
  next();
};
module.exports.resetPassword = (req, res, next) => {

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu mới .");
    return res.redirect("back");
  }
  if (!req.body.confirmPassword) {
    req.flash("error", "Vui lòng xác nhận lại.");
    return res.redirect("back");
  }
  if (req.body.confirmPassword != req.body.password) {
    req.flash("error", "Mật khẩu không trùng khớp.");
    return res.redirect("back");
  }
 
  next();
};
