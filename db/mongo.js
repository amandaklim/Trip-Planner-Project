var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/cis450projectdatabase', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('Connected');
  }
});

var db = mongoose.connection;


var userSchema = new mongoose.Schema({
  personName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // ,
  // friends: Array,
  // homePosts: Array,
  // interests: Array
});

userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// var userPostSchema = new mongoose.Schema({
//   emailUser: String,
//   text: String,
//   personName: String
// });

var Users = mongoose.model('Users', userSchema);
// var UserPosts = mongoose.model('UserPosts', userPostSchema);

module.exports = {
  Users: Users,
  // UserPosts: UserPosts,
  mongoose: mongoose,
};
