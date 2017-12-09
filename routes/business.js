var express = require('express');
var router = express.Router();
// var userPostsDb = require('../db/userPosts');
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');
var oracleDb = require('../modules/oracledbModule');

router.get('/business/:id/:personName/:city', function (req, res, next) {

  usersDb.findUser(req.session.email, function(err, user) {

    res.render('business', {
      errorMessage: req.session.errorMessage,
      personName: req.params.personName,
      userName: req.session.personName,
      //personEmailName: req.params.email,
      //id: req.params.email
      city: req.params.city,
      id: req.session.id
      // ,
      // myPosts: req.session.myPosts,
      // isFriends: req.session.isFriends,
      // email: req.session.email,
      // homePosts: homePosts
    });

  });



});

router.post('/business/:id/:personName/:city', function (req, res, next) {


});


module.exports = router;