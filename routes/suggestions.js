var express = require('express');
var router = express.Router();
// var userPostsDb = require('../db/userPosts');
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');

router.get('/suggestions/:id/:personName', function (req, res, next) {

  usersDb.findUser(req.session.email, function(err, user) {

    res.render('suggestions', {
      errorMessage: req.session.errorMessage,
      personName: req.params.personName,
      userName: req.session.personName,
      //personEmailName: req.params.email,
      //id: req.params.email
      id: req.session.id
      // ,
      // myPosts: req.session.myPosts,
      // isFriends: req.session.isFriends,
      // email: req.session.email,
      // homePosts: homePosts
    });

  });





});

router.post('/suggestions/:id/:personName', function (req, res, next) {
  usersDb.findUser(req.session.email, function (err2, user) {
  req.session.personName = user.personName;
  req.session.user = user;
  req.session.id = user.id;
  req.session.email = user.email;
  req.session.originCity = req.body.originCity;
  //req.session.destCity = req.body.destCity;
  res.redirect('/getSuggestions/' + user.id + '/' + user.personName + '/' + req.session.originCity);
});

});


module.exports = router;