var handleError = function (err, req, res, next) {
  res.render('errorPage', {
    statusCode: res.statusCode,
    message: err.message,
    stackTrace: err.stack
  });
};

module.exports = handleError;