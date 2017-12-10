var express = require('express');
var router = express.Router();
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');

var oracledbModule = require('../modules/oracledbModule');

router.get('/business/:personName/:city', function (req, res, next) {
  res.redirect('/business/' + req.params.personName + '/' + req.params.city + '/all');
});

router.get('/business/:personName/:city/:businessType', function (req, res, next) {
  query = getQueryForBusinessType(req.params.businessType);
  renderBusinesses(req, res, next, query);
});

router.get('/business/:personName/:city/:businessType/sort/:sortCol/:sortOrder', function(req, res, next) {
  query = getQueryForBusinessType(req.params.businessType) + ' ORDER BY ';
  switch(req.params.sortCol) {
    case 'rating':
      query += 'stars ';
      break;
    case 'review_count':
      query += 'review_count ';
      break;
    default:
      query += 'name ';
      break;
  }
  query += (['ASC', 'DESC'].indexOf(req.params.sortOrder) != -1 ? req.params.sortOrder : 'ASC');

  oracledbModule.handleDatabaseConnection(
    query,
    [req.params.city],
    function (result) {
      res.setHeader('Content-Type', 'application/json');
      res.json({ businesses: result.rows });
    }
  );
});

function renderBusinesses(req, res, next, query) {
  usersDb.findUser(req.session.email, function (err, user) {
    oracledbModule.handleDatabaseConnection(
      query,
      [req.params.city],
      function (result) {
        res.render('business', {
          errorMessage: req.session.errorMessage,
          personName: req.params.personName,
          userName: req.session.personName,
          businesses: result.rows,
          city: req.params.city,
          id: req.session.id,
          businessType: req.params.businessType
        });
      }
    );
  });
}

function getQueryForBusinessType(businessType) {
  switch (businessType) {
    case 'vegetarian':
      return "SELECT name, address, stars, review_count FROM businesses WHERE city = :city AND vegetarian = 'TRUE'"
    case 'vegan':
      return "SELECT name, address, stars, review_count FROM businesses WHERE city = :city AND vegan = 'TRUE'"
    case 'kosher':
      return "SELECT name, address, stars, review_count FROM businesses WHERE city = :city AND kosher = 'TRUE'"
    default:
      return 'SELECT name, address, stars, review_count FROM businesses WHERE city = :city';
  }
}

module.exports = router;
