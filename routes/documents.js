var express = require('express');

var router = express.Router();

var Document = require('../models/document');

var isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401);
};

module.exports = function() {
  router.get('/docs', isLoggedIn, function(req, res) {
    Document.findPermittedForUser(req.user.id, function(error, documents) {
      if (error) throw error;
      res.send(JSON.stringify(documents));
    });
  });

  return router;
}


