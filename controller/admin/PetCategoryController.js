const createTreeHelper = require("../../helper/create-tree");
const PetCategory = require("../../model/PetCategoryModel");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const admin = systemConfig.prefixAdmin;
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  // Tìm kiếm 
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
 // Phân trang
    const countProducts = await PetCategory.countDocuments(find);
    
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 4,
      },
      req.query,
      countProducts
    );
  // Lọc sắp xếp
  let sortOption = {};
  if (req.query.sort) {
    let [field, direction] = req.query.sort.split("-");
    // Kiểm tra hợp lệ
    if (field && direction && ["asc", "desc"].includes(direction)) {
      sortOption[field] = direction;
    } else {
      sortOption = { position: "asc" }; // mặc định
    }
  } else {
    sortOption = { position: "asc" }; // mặc định nếu không có sort
  }
  const petsCategory = await PetCategory.find(find).sort(sortOption);

  const categoryTree = createTreeHelper.createTree(petsCategory);
  res.render("admin/pages/pets-category/index", {
    petCategory: categoryTree,
    search: objectSearch.search,
    pagination: objectPagination,
  });
};
// GET: chuyển hướng web tới trạng tạo sản phẩm
module.exports.create = async (req, res) => {
  try {
    // Lấy tất cả danh mục chưa bị xóa
    let find = { deleted: false };

    // Hàm đệ quy tạo cây danh mục
    function createTree(arr, parentId = "") {
      const tree = [];
      arr.forEach((item) => {
        if (item.parent_id === parentId) {
          const newItem = item;
          const children = createTree(arr, item.id);
          if (children.length > 0) {
            newItem.children = children;
          }
          tree.push(newItem);
        }
      });
      return tree;
    }

    const categories = await PetCategory.find(find);
    // gọi hàm tạo cấy danh mục và chuyển data vào
    const categoryTree = createTree(categories);

    // Render view và truyền cả danh sách gốc lẫn cây phân cấp
    res.render("admin/pages/pets-category/create", {
      categories: categoryTree,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh mục:", err);
    res.status(500).send("Lỗi server");
  }
};
// POST: Xử lý dữ liệu và gửi lên server
module.exports.createPost = async (req, res) => {
  // Nếu không nhập vị trí, tự động tăng
  if (!req.body.position) {
    const countProducts = await PetCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position) || 0;
  }
  // Tạo sản phẩm mới
  try {
    const petCategory = new PetCategory(req.body);
    console.log(petCategory);
    await petCategory.save();
    res.redirect(`${systemConfig.prefixAdmin}/pets-category`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi thêm sản phẩm.");
    res.redirect("back");
  }
};
// GET : Lấy ra danh mục theo id gửi lên
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id; // truy vấn lấy id được gửi lên cùng url
    const data = await PetCategory.findOne({
      _id: id,
    });
    const petCategory = await PetCategory.find({ deleted: false }); // Lấy ra tất cả các danh mục
    const categoryTree = createTreeHelper.createTree(petCategory); // Gọi đến hàm createTree tạo ra các cây tree hiên ta giao diện
    res.render("admin/pages/pets-category/edit", {
      data,
      categories: categoryTree,
    });
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};
// PATCH : Lấy ra danh mục theo id và tiến hành cập nhật lại data nếu có sự thanh đổi từ phí user
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id; // truy vấn lấy id được gửi lên cùng url
    req.body.position = parseInt(req.body.position);
    await PetCategory.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công 👻");

    res.redirect(`${admin}/pets-category`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật không thành công 🥺");
    res.redirect(`${admin}/pets-category`);
  }
};
// PATCH: Thay đổ trạng thái pet từ active -> inactive tương ứng với đang bán -> không bán
module.exports.changeStatusItem = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await PetCategory.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    req.flash("success", "Thay đổi trạng thái thành công ");
    res.redirect(`${admin}/pets-category`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thay đổi trạng thái thất bại");
    res.redirect(`${admin}/pets-category`);
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
        await PetCategory.updateMany(
          { _id: { $in: listIds } },
          { deleted: true }
        );
        req.flash("success", "Đã xóa thành công.");
        break;
      case "active":
        await PetCategory.updateMany(
          { _id: { $in: listIds } },
          { status: "active" }
        );
        req.flash("success", "Đã kích hoạt thành công.");
        break;

      case "inactive":
        await PetCategory.updateMany(
          { _id: { $in: listIds } },
          { status: "inactive" }
        );
        req.flash("success", "Đã vô hiệu hóa thành công.");
        break;

      case "change-position":
        const updates = listIds.map((item) => {
          const [id, position] = item.split("-");
          return PetCategory.updateOne({ _id: id }, { position });
        });
        await Promise.all(updates);
        req.flash("success", "Đã cập nhật vị trí thành công.");
        break;

      default:
        req.flash("error", "Hành động không hợp lệ.");
        break;
    }

    res.redirect(`${admin}/pets-category`);
  } catch (error) {
    console.error("Lỗi xử lý hành động hàng loạt:", error);
    req.flash("error", "Đã xảy ra lỗi khi xử lý.");
    res.redirect(`${admin}/pets-category`);
  }
};
// DELETE:Xoa danh mục
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await PetCategory.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      }
    );
    req.flash("Sản phẩm đã được chuyển vào thùng rác ! ");
    res.redirect(`${admin}/pets-category`);
  } catch (error) {
    console.log(error);
    res.redirect(`${admin}/pets-category`);
  }
};