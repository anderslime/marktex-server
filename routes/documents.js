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
    var name = req.body.name || 'Undefined';
    Document.create({
      creator_id: currentUser.id,
      name: name,
      permitted_user_ids: [currentUser.id],
      doc_id: generateUUID()
    }, function(error, document) {
      if (error) throw error;
      res.send(JSON.stringify(document));
    });
  });

  router.put('/docs/:doc_id/permitted_users/:permitted_user_id', isLoggedIn, function(req, res) {
    console.log(req.params);
    var doc_id = req.params('doc_id');
    Document.docPermittedFor(doc_id, req.user.id, function(error, document) {
      if (error) throw error;
      if (document) {
        Document.addPermissionTo(doc_id, req.params('permitted_user_id'), function(
      } else {
        res.send(403);
      }
    });
  });

  return router;
}


