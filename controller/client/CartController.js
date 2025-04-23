const Cart = require("../../model/CartModel");
const Product = require("../../model/PetModel");
const User = require("../../model/UserModel");
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const tokenUser = req.cookies.tokenUser;
  const cart = await Cart.findOne({ _id: cartId });
  if (cart && cart.products.length > 0) {
    for (const item of cart.products) {
      const id = item.product_id;
      const productInfo = await Product.findOne({ _id: id });

      if (productInfo) {
        productInfo.priceNew =
          (productInfo.price * (100 - productInfo.discount)) / 100;
        item.productInfo = productInfo;

        // ✅ Tính tiền từng sản phẩm
        item.totalPrice = item.quantity * productInfo.priceNew;
      }
    }

    // ✅ Tổng tiền toàn bộ giỏ hàng
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
  }

  res.render("client/pages/cart/index", { cart });
};

module.exports.add = async (req, res) => {
  const cartId = req.cookies.cartId;
  const quantity = parseInt(req.body.quantity);
  const productId = req.params.productId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  const exitsProductCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (exitsProductCart) {
    const newQuantity = quantity + exitsProductCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }
  res.redirect("/cart");
};
// Delete Item in Cart
module.exports.deleteItem = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;
  const result = await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: {
        products: {
          product_id: productId,
        },
      },
    }
  );
  console.log(result);
  req.flash("success", "Sản phẩm đã được xóa khỏi giỏ hàng ");
  res.redirect("/cart");
};

// Up

// Update Quantity in Cart
module.exports.updateQuantity = async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  const cartId = req.cookies.cartId;
  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );
  res.redirect("/cart");
};
