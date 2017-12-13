var express = require('express');
var router = express.Router();
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');

var oracledbModule = require('../modules/oracledbModule');

router.get('/businesses/city/:city', function (req, res, next) {
  res.redirect('/businesses/city/' + req.params.city + '/all');
});

router.get('/businesses/city/:city/:businessType', function (req, res, next) {
  var query = getQueryForBusinessType(req.params.businessType);
  var queryParams = getQueryParamsForBusinessType(req);
  renderBusinesses(req, res, next, query, queryParams);
});

router.get('/businesses/city/:city/:businessType/sort/:sortCol/:sortOrder', function(req, res, next) {
  var query = getQueryForBusinessType(req.params.businessType) + ' ORDER BY ';
  var queryParams = getQueryParamsForBusinessType(req);

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
    queryParams,
    function (result) {
      res.setHeader('Content-Type', 'application/json');
      res.json({ businesses: result.rows });
    }
  );
});

router.post('/businesses/city/:city/open', function (req, res, next) {
  res.redirect('/businesses/city/' + req.params.city + '/open' + '?day=' + req.body.day + '&hour=' + req.body.hour + '&minute=' + req.body.minute + '&timeOfDay=' + req.body.timeOfDay);
});

router.get('/businesses/id/:businessId', function (req, res, next) {
  var query = "SELECT * FROM businesses NATURAL JOIN business_hours WHERE business_id = :id ORDER BY CASE WHEN Day = 'Sunday' THEN 1 WHEN Day = 'Monday' THEN 2 WHEN Day = 'Tuesday' THEN 3 WHEN Day = 'Wednesday' THEN 4 WHEN Day = 'Thursday' THEN 5 WHEN Day = 'Friday' THEN 6 WHEN Day = 'Saturday' THEN 7 END ASC, OPEN_HOUR ASC"
  oracledbModule.handleDatabaseConnection(
    query,
    [req.params.businessId],
    function (result) {
      res.setHeader('Content-Type', 'application/json');
      var businessInfo = result.rows[0];
      var businessHours = [];
      for (var i = 0; i < result.rows.length; i++) {
        var business = result.rows[i];
        var hours = {
          day: business[11],
          openTime: makeTime(business[12], business[13]),
          closeTime: makeTime(business[14], business[15])
        };
        businessHours.push(hours);
      }

      var rating = businessInfo[6];
      var businessRatings = [];
      for (var i = 1; i <= 5; i++) {
        if (rating >= i) {
          businessRatings.push('fa-star');
        } else if (rating < i && rating > i - 1) {
          businessRatings.push('fa-star-half-o');
        } else {
          businessRatings.push('fa-star-o');
        }
      }

      res.json({
        businessName: businessInfo[3],
        businessAddress: businessInfo[1],
        businessCity: businessInfo[2],
        businessState: businessInfo[7],
        businessPostalCode: businessInfo[4],
        businessVegetarian: businessInfo[8],
        businessVegan: businessInfo[9],
        businessKosher: businessInfo[10],
        businessRatings: businessRatings,
        businessReviewCount: businessInfo[5],
        businessHours: businessHours
      });
    }
  );
});

function renderBusinesses(req, res, next, query, queryParams) {
  usersDb.findUser(req.session.email, function (err, user) {
    oracledbModule.handleDatabaseConnection(
      query,
      queryParams,
      function (result) {
        res.render('business', {
          errorMessage: req.session.errorMessage,
          personName: req.session.personName,
          userName: req.session.personName,
          businesses: result.rows,
          city: req.params.city,
          id: req.session.id,
          businessType: req.params.businessType,
          openTime: req.query
        });
      }
    );
  });
}

function getQueryForBusinessType(businessType) {
  query = 'SELECT name, address, stars, review_count, business_id ';
  switch (businessType) {
    case 'open':
      return query + 'FROM businesses NATURAL JOIN business_hours WHERE ((open_hour < :hour) OR (open_hour = :hour AND open_minute <= :minute)) AND ((close_hour > :hour) OR (close_hour = :hour AND close_minute >= :minute)) AND day = :day AND city = :city';
    case 'vegetarian':
      return query + "FROM businesses WHERE city = :city AND vegetarian = 'TRUE'";
    case 'vegan':
      return query + "FROM businesses WHERE city = :city AND vegan = 'TRUE'";
    case 'kosher':
      return query + "FROM businesses WHERE city = :city AND kosher = 'TRUE'";
    default:
      return query + 'FROM businesses WHERE city = :city';
  }
}

function getQueryParamsForBusinessType(req) {
  if (req.params.businessType == 'open') {
    var hour = makeHour(req.query.hour, req.query.timeOfDay);
    var minute = parseInt(req.query.minute);
    return [hour, hour, minute, hour, hour, minute, req.query.day, req.params.city];
  } else {
    return [req.params.city];
  }
}

function makeHour(hour, timeOfDay) {
  var hourInt = parseInt(hour);
  if (hourInt == 12 && timeOfDay == 'am') {
    return 0;
  } else if (hourInt != 12 && timeOfDay == 'pm') {
    return hourInt + 12;
  } else {
    return hourInt;
  }
}

function makeTime(hour, minute) {
  return (hour <= 12 ? (hour == 0 ? '12' : hour) : (hour - 12)) + ':' + (minute < 10 ? '0' + minute : minute) + (hour < 12 || hour == 24 ? 'am' : 'pm');
}

module.exports = router;
