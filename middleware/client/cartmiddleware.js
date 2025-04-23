const Cart = require("../../model/CartModel");
module.exports.cartId = async (req, res, next) => {
  const cartId = req.cookies.cartId;
  if (!cartId) {
    // Tạo mới một giỏ hàng
    const cart = new Cart();
    await cart.save();
    const expiresTime = 1000 * 60 * 60 * 24 * 365;
    // Tạo một cartId để lưu sản phẩm vào giỏ hàng
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime),
    });
  } else {
    const cart = await Cart.findOne({
      _id: cartId,
    });
    // Tính tổng số lượng sản phẩm trong giỏ hàng
    cart.totalQuantity = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    // Tạo biến toàn cục 
    res.locals.miniCart = cart;
  }
  next();
};
