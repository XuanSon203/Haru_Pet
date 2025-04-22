module.exports.createPost = (req, res,next) => {
  // Kiểm tra nếu không có tiêu đề
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề sản phẩm.");
    return res.redirect("back");
  }
  // Kiểm tra nếu không có giá
  if (!req.body.price) {
    req.flash("error", "Vui lòng nhập giá cho sản phẩm.");
    return res.redirect("back");
  }
  next();
};
