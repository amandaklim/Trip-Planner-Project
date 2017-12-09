var express = require('express');
var router = express.Router();
// var userPostsDb = require('../db/userPosts');
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');

router.get('/feed/:id/:personName', function (req, res, next) {

  usersDb.findUser(req.session.email, function(err, user) {

    res.render('feed', {
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

  // userPostsDb.getAllUserPosts(function (err, posts) {

  //   usersDb.getFriendsOfUser(req.session.email, function (err, friends) {
  //     var userFriends = [];
  //     if (err) {

  //     } else {

  //       for (var i = 0; i < friends.length; i++) {

  //         userFriends.push({
  //           personName: friends[i].personName,
  //           email: friends[i].email
  //         });



  //       }
  //       homePosts = [];

  //       for (var p = 0; p < posts.length; p++) {
  //         if ((posts[p].emailUser == req.session.email)) {
  //           homePosts.push(posts[p]);
  //         }
  //       }

  //       for (var k = 0; k < posts.length; k++) {
  //         for (var j = 0; j < friends.length; j++) {

  //           console.log(posts[k].emailUser + " d " + posts[k].text);
  //           if (posts[k].emailUser == friends[j].email) {
  //             homePosts.push(posts[k]);
  //           }
  //         }
  //       }

  //       res.render('feed', {
  //         errorMessage: req.session.errorMessage,
  //         personName: req.params.personName,
  //         userName: req.session.personName,
  //         personEmailName: req.params.email,
  //         myPosts: req.session.myPosts,
  //         isFriends: req.session.isFriends,
  //         email: req.session.email,
  //         homePosts: homePosts
  //       });

  //     }
  //   });




  // });



});

router.post('/feed/:id/:personName', function (req, res, next) {
  usersDb.findUser(req.session.email, function (err2, user) {
  req.session.personName = user.personName;
  req.session.user = user;
  req.session.id = user.id;
  req.session.email = user.email;
  req.session.originCity = req.body.originCity;
  req.session.destCity = req.body.destCity;
  res.redirect('/flights/' + user.id + '/' + user.personName);
});

});


module.exports = router;