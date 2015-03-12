var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamps');

var ObjectId = mongoose.Types.ObjectId;
var isValidObjectId = mongoose.Types.ObjectId.isValid;

var documentSchema = mongoose.Schema({
  name: { type: String, required: true },
  creatorId: { type: String, required: true },
  permittedUserIds: { type: [String], required: true }
});

documentSchema.statics.findPermittedDocsForUser = function(user_id, cb) {
  this.find({ permittedUserIds: user_id }).sort('-createdAt').exec(cb);
};

documentSchema.statics.findPermittedDocForUser = function(doc_id, user_id, cb) {
  if (isValidObjectId(doc_id)) {
    this.findOne({ _id: new ObjectId(doc_id), permittedUserIds: user_id }, cb);
  } else {
    cb(null, null);
  }
};

documentSchema.statics.removeIfPermitted = function(docId, userId, cb) {
  if (isValidObjectId(docId)) {
    this.remove({ _id: new ObjectId(docId), permittedUserIds: userId }, cb);
  } else {
    cb(null, null);
  }
};

// Add timestamps createdAt and updatedAt to all documents
documentSchema.plugin(timestamps);

module.exports = mongoose.model('Document', documentSchema);
