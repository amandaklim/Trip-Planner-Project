var express = require('express');
var router = express.Router();
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');
var oracledbModule = require('../modules/oracledbModule');

router.get('/business/:id/:personName/:city', function (req, res, next) {
  renderBusinesses(req, res, next, 'SELECT name, address, stars, review_count FROM businesses WHERE city = :city');
});

function renderBusinesses(req, res, next, query) {
  usersDb.findUser(req.session.email, function (err, user) {
    oracledbModule.handleDatabaseConnection(
      'SELECT name, address, stars, review_count FROM businesses WHERE city = :city',
      [req.params.city],
      function (result) {
        res.render('business', {
          errorMessage: req.session.errorMessage,
          personName: req.params.personName,
          userName: req.session.personName,
          businesses: result.rows,
          city: req.params.city,
          id: req.session.id
        });
      }
    );
  });
}

module.exports = router;
