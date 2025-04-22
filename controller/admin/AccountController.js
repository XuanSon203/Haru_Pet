const Account = require("../../model/AccountModel");
const systemConfig = require("../../config/system");
const Role = require("../../model/RoleModel");
var md5 = require("md5");
const searchHelper = require("../../helper/search");
const admin = systemConfig.prefixAdmin;
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  // Tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.fullName = objectSearch.regex;
  }
  const accounts = await Account.find(find).select("-password -token");
  for (const item of accounts) {
    const role = await Role.findOne({
      _id: item.role_id,
      deleted: false,
    });
    item.role = role;
  }
  res.render("admin/pages/accounts/index", {
    accounts,
    search: objectSearch.search,
  });
};
// GET:Chuyển hướng user tới tràng tạo tài khoản
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/create", { roles });
};
// POST: Nhận dữ liệu từ form gửi lên và xử lý
module.exports.createPost = async (req, res) => {
  if (!req.body.position) {
    const countProducts = await Account.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position) || 0;
  }
  req.body.password = md5(req.body.password);
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", "Email đã tồn tại ");
    res.redirect("back");
  } else {
    const account = new Account(req.body);
    account.save();
    res.redirect(`${admin}/accounts`);
  }
};
// GET: Chuyển hướng tới trang edit
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const roles = await Role.find({ deleted: false });
  const account = await Account.findOne({
    _id: id,
  });

  res.render("admin/pages/accounts/edit", { account, roles });
};
// PATCH: Nhận các trường data được sửa đổi và tiến hành cập nhật lên server
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    // Sử dung $ne để tìm các id không bằng id này
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại `);
    res.redirect("back");
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cật nhập tài khoản thành công ");
    res.redirect(`${admin}/accounts`);
  }
};

// DELETE : Nhận được id từ phía user gửi lên và tiến hành xóa sản phẩm (xóa mềm);
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne(
    {
      _id: id,
    },
    {
      deleted: true,
    }
  );
  res.redirect(`${admin}/accounts`);
};
