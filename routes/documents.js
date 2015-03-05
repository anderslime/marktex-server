var express = require('express');
var generateUUID = require('node-uuid').v4;

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

  router.post('/docs', isLoggedIn, function(req, res) {
    var currentUser = req.user;
    console.log(req.body);
    res.send("ok");
    // Document.create({
    //   creator_id: currentUser.id,
    //   permitted_user_ids: [currentUser.id],
    //   doc_id: generateUUID()
    // }, function(error, document) {
    //   if (error) throw error;
    // });
  });

  return router;
}


