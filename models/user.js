var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.statics.findUsersByFacebookIds = function(fbIds, cb){
	this.find({'facebook.id': { $in: fbIds}}).exec(cb);
};

userSchema.statics.findUserByFacebookId = function(fbId, cb){
	this.findOne({'facebook.id': fbId }).exec(cb);
};

module.exports = mongoose.model('User', userSchema);
