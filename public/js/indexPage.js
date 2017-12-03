var recalculateHrefs = function () {
  var key = $('#key').val();
  var targets = $('#reviews').add('#testkey');
  $(targets).each(function () {
    var base = $(this).data('baseref');
    $(this).attr('href', base + '?key=' + key);
  })
};

$(function () {
  recalculateHrefs();
  $('#key').on('keydown keyup change', recalculateHrefs);
});
