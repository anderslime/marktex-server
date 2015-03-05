var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

var authConfig = require('./auth').facebookAuth;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(user, done) {
    User.findById(id, function(error, user) {
      done(error, user);
    });
  });

  // Facebook
  var facebookCallback = function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'facebook.id': profile.id }, function(error, user) {
        if (error) return done(error);
        if (user) {
          return done(null, user)
        } else {
          var newUser = new User();
          console.log(profile);
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = profile.name.givenName;
          newUser.facebook.email = profile.email;
          newUser.save(function(error) {
            if (error) throw error;
            return done(null, newUser);
          });
        }
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
