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
var oracledb = require('oracledb');

var connectionAttrs = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: 'cis450db.cct52rn5ie4j.us-east-1.rds.amazonaws.com:1521/ORCL'
}

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
//var suggestionsRouter = require('./routes/suggestions');
//app.use('/', suggestionsRouter);
//var similarRouter = require('./routes/similar');
//app.use('/', similarRouter);
//var settingsRouter = require('./routes/settings');
//app.use('/', settingsRouter);

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
      res.redirect('/feed/' + req.session.id + '/' + req.session.personName);
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
        res.redirect('/feed/' + req.session.id + '/' + req.session.personName);
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

function handleDatabaseConnection(query, variables, callback) {
  oracledb.getConnection(connectionAttrs, function(err, connection) {
    console.log('Attempting to connect to Oracle DB');
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Successfully connected to Oracle DB');
    connection.execute(query, variables, function(err, result) {
      if (err) {
        console.error(err.message);
        doRelease(connection);
        return;
      }
      callback(result);
      doRelease(connection);
    });
  });
}

function doRelease(connection) {
  connection.close(function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Successfully closed Oracle DB connection');
    }
  });
}

module.exports = app;
