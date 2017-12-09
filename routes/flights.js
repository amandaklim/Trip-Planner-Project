var express = require('express');
var router = express.Router();
// var userPostsDb = require('../db/userPosts');
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');

router.get('/flights/:id/:personName', function (req, res, next) {

  usersDb.findUser(req.session.email, function(err, user) {

    res.render('flights', {
      errorMessage: req.session.errorMessage,
      personName: req.params.personName,
      userName: req.session.personName,
      originCity: req.session.originCity,
      destCity: req.session.destCity,
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


  // });



});

router.post('/flights/:id/:personName', function (req, res, next) {

});


module.exports = router;