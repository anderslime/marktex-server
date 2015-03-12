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
    Document.findPermittedDocsForUser(req.user.id, function(error, documents) {
      if (error) throw error;
      res.send(documents);
    });
  });

  router.post('/docs', isLoggedIn, function(req, res) {
    var currentUser = req.user;
    var name = req.body.title || 'Undefined';
    Document.create({
      creator_id: currentUser.id,
      name: name,
      permitted_user_ids: [currentUser.id]
    }, function(error, doc) {
      if (error) throw error;
      res.send(doc);
    });
  });

  router.get('/docs/:docId', isLoggedIn, function(req, res) {
    var currentUser = req.user;
    var docId = req.params.docId;
    Document.findPermittedDocForUser(docId, currentUser.id, function(error, doc) {
      if (error) throw error;
      if (doc) {
        res.send(doc);
      } else {
        res.status(404).send({ error:
          "The document does not exists or you might not have the permission to use it."
        });
      }
    });
  });

  return router;
}


