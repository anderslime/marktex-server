var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var isValidObjectId = mongoose.Types.ObjectId.isValid;

var documentSchema = mongoose.Schema({
  name: { type: String, required: true },
  creator_id: { type: String, required: true },
  permitted_user_ids: { type: [String], required: true }
});

documentSchema.statics.findPermittedDocsForUser = function(user_id, cb) {
  this.find({ permitted_user_ids: user_id }, cb);
};

documentSchema.statics.findPermittedDocForUser = function(doc_id, user_id, cb) {
  if (isValidObjectId(doc_id)) {
    this.findOne({ _id: new ObjectId(doc_id), permitted_user_ids: user_id }, cb);
  } else {
    cb(null, null);
  }
};

module.exports = mongoose.model('Document', documentSchema);
