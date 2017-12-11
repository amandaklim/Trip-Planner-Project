var express = require('express');
var router = express.Router();
var usersDb = require('../db/users');
var checkValidUser = require('../middlewares/checkValidUser');

var oracledbModule = require('../modules/oracledbModule');

router.get('/getSuggestions/:id/:personName/:city', function (req, res, next) {
  renderBusinesses(req, res, next, 'WITH relevant_businesses AS (SELECT DISTINCT sa.airport_name AS source_airport, sa.city AS source_city, da.airport_name AS destination_airport, da.city AS destination_city, b.name AS business_name, b.stars AS stars FROM routes r JOIN airports sa ON r.source_id = sa.airport_id JOIN airports da ON r.destination_id = da.airport_id JOIN businesses b ON b.city = da.city WHERE sa.city = :city), best_businesses AS (SELECT destination_city, MAX(stars) AS max_stars FROM relevant_businesses GROUP BY destination_city) SELECT rb.* FROM relevant_businesses rb, best_businesses bb WHERE rb.destination_city = bb.destination_city AND rb.stars = bb.max_stars ORDER BY rb.stars DESC');
});

function renderBusinesses(req, res, next, query) {
  usersDb.findUser(req.session.email, function (err, user) {
    oracledbModule.handleDatabaseConnection(
      'WITH relevant_businesses AS (SELECT DISTINCT sa.airport_name AS source_airport, sa.city AS source_city, da.airport_name AS destination_airport, da.city AS destination_city, b.name AS business_name, b.stars AS stars FROM routes r JOIN airports sa ON r.source_id = sa.airport_id JOIN airports da ON r.destination_id = da.airport_id JOIN businesses b ON b.city = da.city WHERE sa.city = :city), best_businesses AS (SELECT destination_city, MAX(stars) AS max_stars FROM relevant_businesses GROUP BY destination_city) SELECT rb.* FROM relevant_businesses rb, best_businesses bb WHERE rb.destination_city = bb.destination_city AND rb.stars = bb.max_stars ORDER BY rb.stars DESC',
      [req.params.city],
      function (result) {
        //console.log(result);
              //var rating = result.rows[0][5];

      var businessRatings = [];
      for (var j = 0; j < result.rows.length; j++) {
        var resultrating = [];
      for (var i = 1; i <= 5; i++) {
        
        if (result.rows[j][5] >= i) {
          resultrating.push('fa-star');
        } else if (result.rows[j][5] < i && result.rows[j][5] > i - 1) {
          resultrating.push('fa-star-half-o');
        } else {
          resultrating.push('fa-star-o');
        }

      }
businessRatings.push(resultrating);


    }

      
        res.render('getSuggestions', {
          errorMessage: req.session.errorMessage,
          personName: req.params.personName,
          userName: req.session.personName,
          businesses: result.rows,
          city: req.params.city,
          id: req.session.id,
          businessRatings: businessRatings
        });
      }
    );
  });
}

module.exports = router;
