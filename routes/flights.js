var express = require('express');
var router = express.Router();
// var userPostsDb = require('../db/userPosts');
var usersDb = require('../db/users');
var oracleDb = require('../modules/oracledbModule');
var checkValidUser = require('../middlewares/checkValidUser');

router.get('/flights/:id/:personName', function (req, res, next) {


  usersDb.findUser(req.session.email, function(err, user) {

  oracleDb.handleDatabaseConnection('SELECT al.airline_id, al.airline_name, r.source_id, sa.airport_name AS source_airport, r.destination_id, da.airport_name AS destination_airport  FROM routes r JOIN airlines al ON r.airline_id = al.airline_id JOIN airports sa ON r.source_id = sa.airport_id JOIN airports da ON r.destination_id = da.airport_id WHERE r.source_id in (SELECT DISTINCT airport_id FROM airports WHERE city = :source) AND r.destination_id in (SELECT DISTINCT airport_id FROM airports WHERE city = :dest)', [req.session.originCity, req.session.destCity], function(result) {
      //console.log(r2);
      var r = [];
      var incr = 0;
      if (result.rows.length == 0) {
        res.render('no_flights' , {
      errorMessage: req.session.errorMessage,
      personName: req.params.personName,
      userName: req.session.personName,
      originCity: req.session.originCity,
      destCity: req.session.destCity,
      //personEmailName: req.params.email,
      //id: req.params.email
      id: req.session.id
        });
      }
      for (var i = 0; i < result.rows.length; i++) {
      r[i] = [];
      incr = 0;
      for (var j = 1; j < result.rows[i].length;j = j+2) {
          r[i][incr] = result.rows[i][j];
          //console.log(r[i][incr]);
          incr = incr +1;
          
      }
      
      
    }
        res.render('flights', {
      errorMessage: req.session.errorMessage,
      personName: req.params.personName,
      userName: req.session.personName,
      originCity: req.session.originCity,
      destCity: req.session.destCity,
      results:r,
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
  //console.log(r[0][0]);
  //console.log(r.length);

 

  });


  // });



});

router.post('/flights/:id/:personName', function (req, res, next) {

});


module.exports = router;
