var express = require('express');
var generateUUID = require('node-uuid').v4;

var router = express.Router();

var Document = require('../models/document');
var User = require('../models/user');

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
      creatorId: currentUser.id,
      creatorName: currentUser.facebook.name,
      name: name,
      permittedUsers: []
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

  router.put('/docs/:docId', isLoggedIn, function(req, res) {
    var currentUser = req.user;
    var docId = req.params.docId;

    Document.updateIfPermitted(docId, currentUser.id, req.body, function(error, doc) {
      if (error) throw error;
      if (doc) {
        res.send(doc);
      } else {
        res.status(404).end();
      }
    });
  });

  router.delete('/docs/:docId', isLoggedIn, function(req, res) {
    var currentUser = req.user;
    var docId = req.params.docId;
    Document.removeIfPermitted(docId, currentUser.id, function(error, isRemoved) {
      if (error) throw error;
      if (isRemoved) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    });
  });

  return router;
}


