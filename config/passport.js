var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

module.exports = function(passport, authConfig) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
      done(error, user);
    });
  });

  // Facebook
  var facebookCallback = function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'facebook.id': profile.id }, function(error, user) {
        if (error)
          return done(error);

        if (user) {
          var thisUser = user;
        } else {
          var thisUser = new User();
          thisUser.facebook.id = profile.id;
        }
        thisUser.facebook.token = token;
        thisUser.facebook.name = profile.displayName;
        thisUser.facebook.email = profile.emails[0].value;
        thisUser.save(function(error) {
          if (error)
            throw error;
          return done(null, thisUser);
        });
      });
    });
  };

 // Facebook
  var facebookStrategy = new FacebookStrategy({
    clientID: authConfig.clientId,
    clientSecret: authConfig.clientSecret,
    callbackURL: authConfig.callbackUrl
  }, facebookCallback);

  passport.use(facebookStrategy);
};
