var express = require('express');
var router = express.Router();
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');


router.get('/loginUser', function (req, res, next) {
  if (!req.session.errorMessage || req.session.errorMessage === '') {
    req.session.errorMessage = '';
  }
  res.render('login', {
    errorMessage: req.session.errorMessage
  });

});

router.post('/loginUser', function (req, res, next) {

  usersDb.checkIfLegit(req.body.email, req.body.password, function (err, isRight) {
    if (err) {
      req.session.errorMessage = "Invalid email";
      return res.render('login_invalid');
    } else {
      if (isRight) {
        req.session.isAuthenticated = true;

        req.session.email = req.body.email;
        if (req.session.email) {
          usersDb.findUser(req.body.email, function (err2, user) {
            if (err2) {
              req.session.errorMessage = "Invalid email";
              return res.render('login_invalid');
            } else {
              req.session.personName = user.personName;
              req.session.user = user;
              req.session.id = user.id;
              req.session.email = user.email;
              res.redirect('/feed/' + user.id + '/' + user.personName);
            }
          });

        }


      } else {
        req.session.errorMessage = "Invalid password";
        return res.render('login_invalid');
      }
    }
  });




});


module.exports = router;