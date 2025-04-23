// Code thay đổi số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product_id");
      const quantity = parseInt(e.target.value);
      if (quantity => 1) {
        location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}
