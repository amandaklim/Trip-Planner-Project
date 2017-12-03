module.exports = function handleError(req, res, next) {
  res.status(404);
  res.render('errorPage', {
    statusCode: res.statusCode,
    message: 'Page not found.'
  });
};
