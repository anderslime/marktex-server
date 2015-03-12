var express = require('express');
var generateUUID = require('node-uuid').v4;

var router = express.Router();

var Document = require('../models/document');

var isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401);
  res.send({ error: "You haven't logged in yet" });
};

module.exports = function() {
  router.get('/docs', isLoggedIn, function(req, res) {
    Document.findPermittedForUser(req.user.id, function(error, documents) {
      if (error) throw error;
      res.send(documents);
    });
  });

  router.post('/docs', isLoggedIn, function(req, res) {
    var currentUser = req.user;
    var name = req.body.name || 'Undefined';
    Document.create({
      creator_id: currentUser.id,
      name: name,
      permitted_user_ids: [currentUser.id],
      doc_id: generateUUID()
    }, function(error, document) {
      if (error) throw error;
      res.send(document);
    });
  });

  return router;
}


