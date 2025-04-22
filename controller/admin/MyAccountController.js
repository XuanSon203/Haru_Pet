const md5 = require("md5");
const Account = require("../../model/AccountModel");
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index");
};

module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit");
};
// Patch
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  // Kiểm tra email đã tồn tại hay  chưa
  const emailExist = await Account.findOne({
    // Sử dung $ne để tìm các id không bằng id này
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại `);
    res.redirect("/admin/my-account/edit");
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cật nhập tài khoản thành công ");
    res.redirect("/admin/my-account");
  }
};
