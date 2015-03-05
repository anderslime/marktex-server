var mongoose = require('mongoose');

var documentSchema = mongoose.Schema({
  doc_id: String,
  creator_id: String,
  permitted_user_ids: [String]
});

documentSchema.statics.findPermittedForUser = function(user_id, cb) {
  this.find({ permitted_user_ids: user_id }, cb);
};

module.exports = mongoose.model('Document', documentSchema);
