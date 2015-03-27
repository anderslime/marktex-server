var User = require('../models/user');
var fbgraph = require('fbgraph');

module.exports = function(req, res, next) {
  // Check if authenticated through passport (session)
  if (req.isAuthenticated())
    return next();

  // Check if authenticated through facebook, but is missing token
  var facebookToken = req.headers['x-facebook-token'];
  var fbGraphClient = fbgraph.setOptions({ timeout: 2000 });
  fbGraphClient.get("me?access_token=" + facebookToken, function(error, response) {
    if (error) {
      return res.status(401).send({ error: "Could not connect to Facebook" });
    }
    User.findUserByFacebookId(response.id, function(error, user) {
      if (error)
        throw error;
      if (user) {
        req.login(user, function(done) {
          next();
        });
      } else {
        res.status(401).end();
      }
    });
  });
};

