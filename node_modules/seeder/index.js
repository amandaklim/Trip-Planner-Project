'use strict';

var async = require('async');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function seeder(seedObject, mongoose, logger, cb) {
  if(!cb) {
    cb = logger;
    logger = console.log;
  }

  var ObjectId = mongoose.Types.ObjectId;

  async.each(Object.keys(seedObject), function(mongoModel, cb) {
    var documents = seedObject[mongoModel];
    var mongoModelName = capitalize(mongoModel);
    var Model = mongoose.model(mongoModelName);

    async.each(Object.keys(documents), function(_id, cb) {
      var document = documents[_id];

      if(document._id) {
        _id = document._id;
      }

      // Fake an upsert call, to keep the hooks
      Model.findById(_id, function(err, mongoDocument) {
        if(err) {
          return cb(err);
        }
        if(!mongoDocument) {
          mongoDocument = new Model({_id: new ObjectId(_id)});
        }

        for(var key in document) {
          mongoDocument[key] = document[key];
          mongoDocument.markModified(key);
        }

        logger(mongoModelName, _id);
        mongoDocument.save(cb);
      });
    }, cb);
  }, cb);
};
