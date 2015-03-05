var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

// MongoDB (mongoose)
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// Passport
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(session({
  secret: 'helloworld',
  cookie: { domain: '.marktexx.dev' }
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('cors')({
  origin: 'http://www.marktexx.dev',
  credentials: true
}));
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.use('/', require('./routes/user')(passport));

require('node-pow')('marktexx', 3000);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
