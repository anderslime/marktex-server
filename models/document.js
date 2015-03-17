var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamps');
var User = require('./user');

var ObjectId = mongoose.Types.ObjectId;
var isValidObjectId = mongoose.Types.ObjectId.isValid;

//REMOVE
var userSchema = mongoose.Schema({
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});
//END REMOVE

var documentSchema = mongoose.Schema({
  name: { type: String, required: true },
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  permittedUsers: { type: [userSchema], required: false }
});

var permittedQuery = function(user_id){ return { '$or': [{ creatorId: user_id }, { 'permittedUsers._id': new ObjectId(user_id) }]}; };

documentSchema.statics.findPermittedDocsForUser = function(user_id, cb) {
  this.find(permittedQuery(user_id)).sort('-createdAt').exec(cb);
};

documentSchema.statics.findPermittedDocForUser = function(doc_id, user_id, cb) {
  if (isValidObjectId(doc_id)) {
    this.findOne(permittedQuery(user_id), cb);
  } else {
    cb(null, null);
  }
};

documentSchema.statics.removeIfPermitted = function(docId, user_id, cb) {
  if (isValidObjectId(docId)) {
    this.remove(permittedQuery(user_id), cb);
  } else {
    cb(null, null);
  }
};

documentSchema.statics.updateIfPermitted = function(docId, user_id, data, cb) {
  if (isValidObjectId(docId)) {
    this.findOneAndUpdate(
      { '$and': [{_id: new ObjectId(docId)}, permittedQuery(user_id)] },
      {'$set':
        {
          name: data.name,
          'permittedUsers': data.permittedUsers
        }
      },
      cb
    );
  } else {
    cb(null, null);
  }
};

// Add timestamps createdAt and updatedAt to all documents
documentSchema.plugin(timestamps);

module.exports = mongoose.model('Document', documentSchema);
