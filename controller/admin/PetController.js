const Pet = require("../../model/PetModel");
const searchHelper = require("../../helper/search");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helper/pagination");
const PetCategory = require("../../model/PetCategoryModel");
const admin = systemConfig.prefixAdmin;
// GET : lấy ra danh sách pet có trong trang web
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };
    const countProducts = await Pet.countDocuments(find);

    // Tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.name = objectSearch.regex;
    }
    // Phân trang
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
    // Filter
    const status = req.query.status;
    const sex = req.query.sex;
    if (status) {
      find.status = status;
    }
    if (sex) {
      find.sex = sex;
    }

    let sortOption = {};
    if (req.query.sort) {
      let [field, direction] = req.query.sort.split("-");
      // Cho phép sắp xếp theo name hoặc position
      if (
        field &&
        direction &&
        ["asc", "desc"].includes(direction) &&
        ["name", "position"].includes(field)
      ) {
        sortOption[field] = direction;
      } else {
        sortOption = { position: "asc" };
      }
    } else {
      sortOption = { position: "asc" };
    }

    //
    const pets = await Pet.find(find)
      .sort(sortOption)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
    //  Lất ra danh muc của sản phẩm
    const petCategory = await PetCategory.find({ deleted: false });
    console.log(petCategory);
    res.render("admin/pages/pets/index", {
      pets,
      search: objectSearch.search,
      pagination: objectPagination,
      categories: petCategory,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Danh sách hiển thị lỗi ");
    return;
  }
};
// GET : Chuyển hướng tới trang thêm pet
module.exports.create = async (req, res) => {
  const petCategory = await PetCategory.find({ deleted: false });

  res.render("admin/pages/pets/create", {
    categories: petCategory,
  });
};
// Post : Xử lý các thông tin từ form gửi lên server và lưu vào database
module.exports.createPost = async (req, res) => {
  try {
    req.body.weight = parseInt(req.body.weight);
    req.body.height = parseInt(req.body.height);
    req.body.price = parseInt(req.body.price);
    req.body.discount = parseInt(req.body.discount);
    if (!req.body.position) {
      const countPet = await Pet.countDocuments();
      req.body.position = countPet + 1;
    } else {
      req.body.position = parseInt(req.body.position) || 0;
    }

    const pet = new Pet(req.body);
    pet.save();
    req.flash("success", "Thêm pet thành công");
    res.redirect(`${admin}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm pet thất bại ");
    res.redirect(`back`);
  }
};
// GET: Chuyển hướng tới trang chỉnh sửa pet
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const petCategory = await PetCategory.find({ deleted: false });

    const data = await Pet.findOne({ _id: id });
    res.render("admin/pages/pets/edit", { data, categories: petCategory });
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};
// PATCH: Sử thông tin về pet và cật nhật lại thông tin đã sửa
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.weight = parseInt(req.body.weight);
    req.body.height = parseInt(req.body.height);
    req.body.price = parseInt(req.body.price);
    req.body.discount = parseInt(req.body.discount);
    const result = await Pet.updateOne(
      {
        _id: id,
      },
      req.body
    );
    if (result === 200) {
      req.flash("success", "Thông tin đã được cập nhật thành công ");
      res.redirect(`${admin}/pets`);
    }
    res.redirect(`${admin}/pets`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Cật nhập thông tin thất bại ");
    res.redirect(`${admin}/pets`);
  }
};
// DELETE: Xóa mềm các pet -> chuyển deleted:false -> deleted:true
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Pet.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      }
    );
    req.flash("Sản phẩm đã được chuyển vào thùng rác ! ");
    res.redirect(`${admin}/pets`);
  } catch (error) {
    console.log(error);
    res.redirect(`${admin}/pets`);
  }
};
// GET : Xử lý tìm kiếm pet theo tên
module.exports.search = async (req, res) => {
  const query = req.params.query;
  console.log(query);
  res.send("OK");
};
// PATCH: Thay đổ trạng thái pet từ active -> inactive tương ứng với đang bán -> không bán
module.exports.changeStatusItem = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await Pet.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    req.flash("success", "Thay đổi trạng thái thành công ");
    res.redirect(`${admin}/pets`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thay đổi trạng thái thất bại");
    res.redirect(`${admin}/pets`);
  }
};
// PATCH :Thay đổi trạng thái nhiều sản phẩm
module.exports.changeMulti = async (req, res) => {
  try {
    const { action, ids } = req.body;

    if (!action || !ids) {
      return res.status(400).send("Thiếu dữ liệu hành động hoặc danh sách ID.");
    }

    const listIds = ids.split(",");

    switch (action) {
      case "delete":
        await Pet.updateMany({ _id: { $in: listIds } }, { deleted: true });
        req.flash("success", "Đã xóa thành công.");
        break;
      case "active":
        await Pet.updateMany({ _id: { $in: listIds } }, { status: "active" });
        req.flash("success", "Đã kích hoạt thành công.");
        break;

      case "inactive":
        await Pet.updateMany({ _id: { $in: listIds } }, { status: "inactive" });
        req.flash("success", "Đã vô hiệu hóa thành công.");
        break;

      case "change-position":
        const updates = listIds.map((item) => {
          const [id, position] = item.split("-");
          return Pet.updateOne({ _id: id }, { position });
        });
        await Promise.all(updates);
        req.flash("success", "Đã cập nhật vị trí thành công.");
        break;

      default:
        req.flash("error", "Hành động không hợp lệ.");
        break;
    }

    res.redirect(`${admin}/pets`);
  } catch (error) {
    console.error("Lỗi xử lý hành động hàng loạt:", error);
    req.flash("error", "Đã xảy ra lỗi khi xử lý.");
    res.redirect(`${admin}/pets`);
  }
};
// GET: chuyên hướng tới trang chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const pet = await Pet.findOne({
    _id: id,
  });
  const categories = await PetCategory.find({ deleted: false });
  res.render("admin/pages/pets/detail", {
    pet,
    categories,
  });
};
