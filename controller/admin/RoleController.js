const Role = require("../../model/RoleModel");
const systemConfig = require("../../config/system");
const admin = systemConfig.prefixAdmin;
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const roles = await Role.find(find);
  res.render("admin/pages/roles/index", { roles });
};
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create");
};
module.exports.createPost = async (req, res) => {
  const role = new Role(req.body);
  role.save();
  res.redirect(`${admin}/roles`);
};
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const role = await Role.findOne({
    _id: id,
  });
  res.render("admin/pages/roles/edit", { role });
};
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne(
    {
      _id: id,
    },
    req.body
  );
  res.redirect(`${admin}/roles`);
};
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await Role.updateOne(
    {
      _id: id,
    },
    {
      deleted: true,
    }
  );
  res.redirect(`${admin}/roles`);
};
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render(`admin/pages/roles/permissions`, { records });
};
// Patch Permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    const id = item.id;
    const permissions = item.permissions;
    await Role.updateOne({ _id: id }, { permissions: permissions });
  }
  req.flash("success", "Cật nhập phân quyền thành công ");
  res.redirect(`${admin}/roles/permissions`);
};
