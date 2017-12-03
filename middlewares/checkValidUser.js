var usersDb = require('../db/users');

var checkValidUser = function (req, res, next) {
  if (req.session.isAuthenticated) {
    req.session.personName = usersDb.findName(req.session.email, next);
    res.redirect('/userHomePage');
  }};


module.exports = checkValidUser;