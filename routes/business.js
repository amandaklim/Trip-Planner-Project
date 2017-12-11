var express = require('express');
var router = express.Router();
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');

var oracledbModule = require('../modules/oracledbModule');

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

router.get('/businesses/city/:city', function (req, res, next) {
  res.redirect('/businesses/' + req.params.city + '/all');
});

router.get('/businesses/city/:city/:businessType', function (req, res, next) {
  query = getQueryForBusinessType(req.params.businessType);
  renderBusinesses(req, res, next, query);
});

router.get('/businesses/city/:city/:businessType/sort/:sortCol/:sortOrder', function(req, res, next) {
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
          personName: req.session.personName,
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
  query = "SELECT name, address, stars, review_count, business_id FROM businesses WHERE city = :city"
  switch (businessType) {
    case 'vegetarian':
      return query + " AND vegetarian = 'TRUE'";
    case 'vegan':
      return query + " AND vegan = 'TRUE'";
    case 'kosher':
      return query + " AND kosher = 'TRUE'";
    default:
      return query;
  }
}

function makeTime(hour, minute) {
  return (hour <= 12 ? (hour == 0 ? '12' : hour) : (hour - 12)) + ':' + (minute < 10 ? '0' + minute : minute) + (hour < 12 || hour == 24 ? 'am' : 'pm');
}

//my code that does not work

// router.post('/business/:id/:personName/:city', function (req, res, next) {
//   getHours(req, res, next, 'SELECT b.name, b.address, b.city, h.open_hour, h.open_minute, h.close_hour, h.close_minute FROM businesses b NATURAL JOIN business_hours h WHERE ((h.open_hour < :hour) OR (h.open_hour = :hour1 AND h.open_minute <= :minute)) AND ((h.close_hour > :hour2) OR (h.close_hour = :hour3 AND h.close_minute >= :minute4)) AND h.day = :day AND b.city = :city');
// });

// function getHours(req, res, next, query) {
//     usersDb.findUser(req.session.email, function (err, user) {
//     oracledbModule.handleDatabaseConnection(
//       'SELECT b.name, b.address, b.city, h.open_hour, h.open_minute, h.close_hour, h.close_minute FROM businesses b NATURAL JOIN business_hours h WHERE ((h.open_hour < :hour) OR (h.open_hour = :hour1 AND h.open_minute <= :minute)) AND ((h.close_hour > :hour2) OR (h.close_hour = :hour3 AND h.close_minute >= :minute4)) AND h.day = :day AND b.city = :city',
//       [req.params.hour, req.params.hour, req.params.minute, req.params.hour, req.params.hour,
//        req.params.minute, req.params.day, req.params.city],
//       function (result) {
//         console.log(result);
//         res.render('business', {

//           errorMessage: req.session.errorMessage,
//           personName: req.params.personName,
//           userName: req.session.personName,
//           businesses: result.rows,
//           city: req.params.city,
//           id: req.session.id
//         });
//       }
//     );
//   });
// }

module.exports = router;
