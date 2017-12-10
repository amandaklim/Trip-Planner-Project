if (process.env.NODE_ENV !== 'production') { require('dotenv').load(); }

var express = require('express');
var helpers = require('express-helpers');
var app = express();
helpers(app);
var uuid = require('node-uuid');
var User = require('./db/users.js');
var handleError = require('./middlewares/handleError');
var pageNotFound = require('./middlewares/pageNotFound');
var isAuthenticated = require('./middlewares/isAuthenticated');

process.on('SIGINT', function() {
  process.exit(0);
});

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

var cookieSession = require('cookie-session');
app.use(cookieSession({
  secret: generateCookieSecret()
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));

var loginRouter = require('./routes/login');
app.use('/', loginRouter);
//var profileRouter = require('./routes/profile');
//app.use('/', profileRouter);
//var allRouter = require('./routes/all');
//app.use('/', allRouter);
//var friendsRouter = require('./routes/friends');
//pp.use('/', friendsRouter);
var feedRouter = require('./routes/feed');
app.use('/', feedRouter);
var welcomeRouter = require('./routes/welcome');
app.use('/', welcomeRouter);
var suggestionsRouter = require('./routes/suggestions');
app.use('/', suggestionsRouter);
var getSuggestionsRouter = require('./routes/getSuggestions');
app.use('/', getSuggestionsRouter);
//var suggestionsRouter = require('./routes/suggestions');
//app.use('/', suggestionsRouter);
//var similarRouter = require('./routes/similar');
//app.use('/', similarRouter);
//var settingsRouter = require('./routes/settings');
//app.use('/', settingsRouter);
var flightsRouter = require('./routes/flights');
app.use('/', flightsRouter);
var businessRouter = require('./routes/business');
app.use('/', businessRouter);

app.get('/userHomePage/:id/:personName', function (req, res) {
  User.findUser(req.body.id, function (err2, user) {
    if (err2) {
      res.send('error' + err2);
    } else {
      if (!req.session.id || req.session.id === '') {
        res.send('You tried to access a protected page');
      }
      req.session.personName = req.body.personName;
      req.session.id = req.body.id;
      req.session.user = user;
      res.redirect('/welcome/' + req.session.id + '/' + req.session.personName);
    }
  });
});

app.get('/logout', function (req, res) {
  req.session.personName = '';
  req.session.email = '';
  req.session.errorMessage = '';
  req.session.user = null;
  res.render('index');
});

app.get('/contact', function(req, res) {
  res.render('contact', {
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
})

app.get('/register', function (req, res) {
  res.render('createAccount');
});

app.post('/register', function (req, res) {
  
    User.addUser(req.body.personName, req.body.email, req.body.password, function (err) {
      User.findUser(req.body.email, function (err2, user) {

      if (err) {
        res.send('Unable to register user');
      } else {

        req.session.personName = req.body.personName;
        req.session.email = req.body.email;
        req.session.id = user.id
        // req.session.usersFriends = [];
        // req.session.homePosts = [];
        // req.session.interests = [];
        req.session.user = user;
        res.redirect('/welcome/' + req.session.id + '/' + req.session.personName);
      }
    });
  });
});

app.use(handleError);
app.use(pageNotFound);
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('listening');
});

module.exports = app;
