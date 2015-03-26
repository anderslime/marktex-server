var express = require('express');
var router = express.Router();
var User = require('../models/user');
var config = require('../tmp/config');

var isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).end();
};

/* GET users listing. */
module.exports = function(passport) {
  router.get('/me', isLoggedIn, function(req, res) {
    var user = req.user;
    res.send({
      id: user._id,
      name: user.facebook.name
    });
  });

  router.post('/facebookIdsToUsers', isLoggedIn, function(req, res) {
    var user = req.user;

    var users = User.findUsersByFacebookIds(req.body.facebookIds, function(error, users){
      //do not wave around other users tokens
      users.forEach(function(u,i){
        u.facebook.token = undefined;
      });
      res.send(users);
    });
  });

  router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
  );

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: config.urls.editor,
      successRedirect: config.urls.editor
    })
  );

  router.get('/profile', isLoggedIn, function(req, res) {
    res.send(req.user);
  });

  router.get('/logout', isLoggedIn, function(req, res) {
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect(config.urls.editor);
  });

  return router
}
