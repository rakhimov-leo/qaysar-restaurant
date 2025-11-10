console.log("Restaurant Signup JS");

$(function () {
  $(".upload-hidden").on("change", function () {
    const uploadFile = this.files[0];
    if (!uploadFile) return;

    const validTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!validTypes.includes(uploadFile.type)) {
      alert("Please upload only jpg, jpeg, or png!");
      return;
    }

    $("#preview-img").attr("src", URL.createObjectURL(uploadFile));
    $(".upload-name").val(uploadFile.name);
  });
});

function validateSignupForm() {
  const nick = $(".member-nick").val(),
    phone = $(".member-phone").val(),
    pass = $(".member-password").val(),
    confirm = $(".confirm-password").val();

  if (!nick || !phone || !pass || !confirm) {
    alert("Please insert all required inputs");
    return false;
  }

  if (pass !== confirm) {
    alert("Password differs, please check!");
    return false;
  }

  const image = $(".member-image")[0]?.files?.length > 0;
  if (!image) {
    alert("Please insert restaurant image!");
    return false;
  }
}
