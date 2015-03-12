var express = require('express');
var router = express.Router();
var User = require('../models/user');
var config = require('../tmp/config');

var isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).done();
};

/* GET users listing. */
module.exports = function(passport) {
  router.get('/users', isLoggedIn, function(req, res) {
    User.find({}, function(e, users) {
      if (e)
        res.status(500).done(); //500 might not be the best option here

      res.send(JSON.stringify(users));
    });
  });

  router.get('/me', isLoggedIn, function(req, res) {
    var user = req.user;
    res.send(JSON.stringify({
      id: user._id,
      name: user.facebook.name
    }));
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
    res.send(JSON.stringify(req.user));
  });

  return router
}
