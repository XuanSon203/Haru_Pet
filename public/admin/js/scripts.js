//  PreviewImage Upload
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const btnRemoveImage = document.querySelector("[upload-image-remove]");
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const [file] = e.target.files;
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      btnRemoveImage.addEventListener("click", (e) => {
        uploadImageInput.value = "";
        uploadImagePreview.src = "";
      });
    }
  });
}
const formDelete = document.querySelector("[form-delete-item]");
if (formDelete) {
  const btnDelete = document.querySelectorAll("[btn-delete-item]");
  const path = formDelete.getAttribute("data-path");
  btnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const isConfig = confirm("Bạn có chắc muốn xóa không ? ");
      if (isConfig) {
        const action = `${path}/${id}?_method=DELETE`;
        console.log(action);
        formDelete.action = action;
        formDelete.submit();
      }
    });
  });
}
//Code form xử lý tìm kiếm
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    let url = new URL(location.href);
    const search = e.target[0].value;
    if (search) {
      url.searchParams.set("search", search);
    } else {
      url.searchParams.delete("search");
    }
    location.href = url.href;
  });
}
const btnChangeStatusItem = document.querySelectorAll("[btn-change-status]");
if (btnChangeStatusItem) {
  const formChangeStatusItem = document.querySelector(
    "[form-change-status-item]"
  );
  if (formChangeStatusItem) {
    const path = formChangeStatusItem.getAttribute("data-path");
    btnChangeStatusItem.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const status = btn.getAttribute("data-status");
        const id = btn.getAttribute("data-id");
        const changeStatus = status == "active" ? "inactive" : "active";
        const action = `${path}/${changeStatus}/${id}?_method=PATCH`;
        formChangeStatusItem.action = action;
        formChangeStatusItem.submit();
      });
    });
  }
}
//  Code xử lý chọn checkbox
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const checkAll = checkboxMulti.querySelector("[check-all]");
  const checkItem = checkboxMulti.querySelectorAll("[check-item]");
  checkAll.addEventListener("click", () => {
    if (checkAll.checked) {
      checkItem.forEach((check) => {
        check.checked = true;
      });
    } else {
      checkItem.forEach((item) => {
        item.checked = false;
      });
    }
  });
  checkItem.forEach((item) => {
    item.addEventListener("click", () => {
      const countItemCheck = checkboxMulti.querySelectorAll(
        "[check-item]:checked"
      ).length;
      if (countItemCheck === checkItem.length) {
        checkAll.checked = true;
      } else {
        checkAll.checked = false;
      }
    });
  });
}
// Xử lý và gửi dữ liêu từ form lên server
const formChangeMulti = document.querySelector("[change-multi]");

if (formChangeMulti && checkboxMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkedItems = checkboxMulti.querySelectorAll("[check-item]:checked");
    const actionSelect = formChangeMulti.querySelector("#action").value;

    if (checkedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một mục.");
      return;
    }

    // Nếu là xóa thì hỏi xác nhận
    if (actionSelect === "delete") {
      const isConfirm = confirm(
        "Bạn có chắc chắn muốn xóa những sản phẩm này không?"
      );
      if (!isConfirm) return;
    }

    // Lấy danh sách ID hoặc ID - position
    let ids = [];
    checkedItems.forEach((item) => {
      const id = item.value;
      if (actionSelect == "change-position") {
        const positionInput = item
          .closest("tr")
          .querySelector("input[name='position']");
        const position = positionInput ? positionInput.value : "";
        ids.push(`${id}-${position}`);
      } else {
        ids.push(id);
      }
    });

    // Gán giá trị vào input hidden
    const inputValues = formChangeMulti.querySelector("#input-values");
    inputValues.value = ids.join(",");
    console.log(inputValues);
    console.log(ids);
    // Gửi form
    formChangeMulti.submit();
  });
}

//Xử logic cho thông báo
const showAlert = document.querySelector("#show-alert");
const closeAlert = document.querySelector("#close-alert");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.style.display = "none";
  });
}
//  Bắt sự kiên cho sắp xếp sản phẩm
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(location.href);
  const sortSelect = sort.querySelectorAll("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  // Gán lại selected cho các option nếu tồn tại giá trị
  sortSelect.forEach((select) => {
    const name = select.name;
    const value = url.searchParams.get(name);
    if (value) {
      const option = select.querySelector(`option[value="${value}"]`);
      if (option) option.selected = true;
    }
  });

  // Xóa lọc
  sortClear.addEventListener("click", () => {
    ["status", "sex", "sortKeyValue"].forEach((key) =>
      url.searchParams.delete(key)
    );
    location.href = url.href;
  });
}
// Sự kiên cho phân trang 
const btnPagnation = document.querySelectorAll("[button-pagination]");
if (btnPagnation) {
  btnPagnation.forEach((btn) => {
    let url = new URL(window.location.href);
    btn.addEventListener("click", (e) => {
      const page = btn.getAttribute("button-pagination");

      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}