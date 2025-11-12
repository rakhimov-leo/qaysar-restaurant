console.log("Products frontend javascript file");

$(function () {
  $(".product-collection").on("change", () => {
    const selectedValue = $(".product-collection").val();
    if (selectedValue === "DRINK") {
      $("#product-collection").hide();
      $("#product-volume").show();
    } else {
      $("#product-volume").hide();
      $("#product-collection").show();
    }
  });

  $("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").hide();
  });

  $("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(100);
    $("#process-btn").show();
  });

  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id;
    if (!id) return console.error("Product ID undefined for status change");

    const productStatus = $(`#${id}.new-product-status`).val();

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus,
      });
      if (response.data?.data) {
        console.log("Product updated!");
      } else alert("Product update failed!");
    } catch (err) {
      console.error(err);
      alert("Product update failed!");
    }
  });
});

function validateForm() {
  const productName = $(".product-name").val();
  const productPrice = $(".product-price").val();
  const productLeftCount = $(".product-left-count").val();
  const productCollection = $(".product-collection").val();
  const productDesc = $(".product-desc").val();
  const productStatus = $(".product-status").val();

  if (
    !productName ||
    !productPrice ||
    !productLeftCount ||
    !productCollection ||
    !productDesc ||
    !productStatus
  ) {
    alert("Please insert all details!");
    return false;
  }
  return true;
}

function previewFileHandler(input, order) {
  const file = input.files[0];
  const validTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (!validTypes.includes(file?.type)) {
    alert("Please insert only jpg, jpeg or png");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    $(`#image-section-${order}`).attr("src", reader.result);
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector(".table");

  table.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const row = e.target.closest("tr");
      toggleEdit(row);
    }
  });

  table.addEventListener("change", async (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    const productId = row.dataset.id;
    if (!productId) return console.error("Product ID undefined");

    const productName =
      row.querySelector(".input-name")?.value ||
      row.querySelector(".td-name").textContent;
    const productPrice =
      row.querySelector(".input-price")?.value ||
      row.querySelector(".td-price").textContent;
    const productLeftCount =
      row.querySelector(".input-count")?.value ||
      row.querySelector(".td-count").textContent;
    const productStatus = row.querySelector(".new-product-status")?.value;

    try {
      const res = await fetch(`/admin/product/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productPrice,
          productLeftCount,
          productStatus,
        }),
      });
      const result = await res.json();
      if (result.message) alert(result.message);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  });
});

function toggleEdit(row) {
  const nameTd = row.querySelector(".td-name");
  const priceTd = row.querySelector(".td-price");
  const countTd = row.querySelector(".td-count");

  if (row.classList.contains("editing")) {
    row.classList.remove("editing");
    row.querySelector(".input-name")?.remove();
    row.querySelector(".input-price")?.remove();
    row.querySelector(".input-count")?.remove();
  } else {
    row.classList.add("editing");

    const inputName = document.createElement("input");
    inputName.value = nameTd.textContent;
    inputName.className = "input-name";
    nameTd.textContent = "";
    nameTd.appendChild(inputName);

    const inputPrice = document.createElement("input");
    inputPrice.type = "number";
    inputPrice.value = priceTd.textContent;
    inputPrice.className = "input-price";
    priceTd.textContent = "";
    priceTd.appendChild(inputPrice);

    const inputCount = document.createElement("input");
    inputCount.type = "number";
    inputCount.value = countTd.textContent;
    inputCount.className = "input-count";
    countTd.textContent = "";
    countTd.appendChild(inputCount);
  }
}
