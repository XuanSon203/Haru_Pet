module.exports.createPost = (req, res, next) => {
  // Kiểm tra nếu không có tiêu đề
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề sản phẩm.");
    return res.redirect("back");
  }

  next();
};
