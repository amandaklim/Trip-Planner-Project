var changeButtonText = function () {
  $("button").click(function () {
    $(this).html("Delete friend");
  })
};

$(function () {
 changeButtonText();
});
