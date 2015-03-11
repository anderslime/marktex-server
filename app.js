var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var config = require('./tmp/config');

var app = express();

// MongoDB (mongoose)
var mongoose = require('mongoose');
var mongoUrl = config.mongoURL;
mongoose.connect(mongoUrl);

// Passport
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(session({
  secret: 'b8092a4014b44731159420429560d41c7428d2e8a625ae0e48b0de2c895fce53ff',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('cors')({ origin: config.cors, credentials: true }));
app.use(passport.initialize());
app.use(passport.session()); // Important that this is used after session


require('./config/passport')(passport, config.facebook)

app.use('/', require('./routes/user')(passport));
app.use('/', require('./routes/documents')());

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
