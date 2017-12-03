var mongo = require('./mongo');
var bcrypt = require('bcrypt');

module.exports = {
  getAllUsers: function (callback) {
    mongo.Users.find().sort({
      $natural: -1
    }).exec(function (error, users) {
      callback(error, users);
    });
  },

  addUser: function (personName, email, password, callback) {
    var newUser = new mongo.Users({
      personName: personName,
      email: email,
      password: password
      // ,
      // friends: [],
      // homePosts: [],
      // interests: []
    });
    newUser.save(function (error) {
      callback(error);
    });
  },

  findUser: function (email, cb) {
    mongo.Users.findOne({
      email: email
    }, function (err, user) {
      if (!user) cb('no user');
      else {
        cb(null, user);
      };
    });
  },

  checkIfLegit: function (email, password, cb) {
    mongo.Users.findOne({
      email: email
    }, function (err, user) {
      if (!user) cb('no user');
      else {
        bcrypt.compare(password, user.password, function (err, isRight) {
          if (err) return cb(err);
          cb(null, isRight);
        });
      };
    });
  },


};