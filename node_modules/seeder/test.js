"use strict";

require('should');
var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
var seeder = require('./index.js');

var logger = function() {};

describe("seeder api", function() {
  before(function connectMongoose(done) {
    mongoose.connect('mongodb://localhost/test');
    done();
  });
  before(function dropDB(done) {
    mongoose.connection.on('open', function connOpen() {
      mongoose.connection.db.dropDatabase(done);
    });
  });
  before(function createModel(done) {
    this.Cat = mongoose.model('Cat', { name: String });
    done();
  });
  before(function populateOne(done) {
    this.kitty = new this.Cat({ name: 'Zildjian' });
    this.kitty.save(done);
  });

  it('should create the missing entities', function(done) {
    var seedObject = {
      cat: {
        "5252ce4ce4cfcd16f55cfa3d": {
          name: "Bobby"
        }
      }
    };
    async.waterfall([
      function startSeed(cb) {
        seeder(seedObject, mongoose, logger, cb);
      },
      function querySeed(cb) {
        this.Cat.findOne(
          { _id: new ObjectId("5252ce4ce4cfcd16f55cfa3d") },
          cb
        );
      }.bind(this),
      function assertSeed(cat, cb) {
        cat.should.have.property('name', 'Bobby');
        cb();
      }
    ], done);
  });

  it('should update the existing entities', function(done) {
    var seedObject = {
      cat: {}
    };
    seedObject.cat[this.kitty._id.toString()] = {
      name: "Mary"
    };
    async.waterfall([
      function startSeed(cb) {
        seeder(seedObject, mongoose, logger, cb);
      },
      function querySeed(cb) {
        this.Cat.findOne(
          { _id: this.kitty._id },
          cb
        );
      }.bind(this),
      function assertSeed(cat, cb) {
        cat.should.have.property('name', 'Mary');
        cb();
      }
    ], done);
  });

  it('should use _id field', function(done) {
    var seedObject = {
      cat: {
        "cha-256": {
          name: "Bobby",
          _id: "5252ce4ce4cfcd16f55cfa3e"
        }
      }
    };
    async.waterfall([
      function startSeed(cb) {
        seeder(seedObject, mongoose, logger, cb);
      },
      function querySeed(cb) {
        this.Cat.findOne(
          { _id: new ObjectId("5252ce4ce4cfcd16f55cfa3e") },
          cb
        );
      }.bind(this),
      function assertSeed(cat, cb) {
        cat.should.have.property('name', 'Bobby');
        cb();
      }
    ], done);
  });
});
