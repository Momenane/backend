var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var rateLimit = require("express-rate-limit");
// var csurf = require('csurf')
var helmet = require('helmet')
var favicon = require('serve-favicon')
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "replace secret key in production",
  name: "id_session",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 3600000 }
}));
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(upload.array());
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/register/', userLimiter);
app.use('/login/', userLimiter);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// passport config
var User = require('./models').User;
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findOne({ where: { id } }).then((user) => {
    done(null, user);
  }).catch((err) => done(err, null));
});
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      attributes: ['id', 'role', 'password', 'salt'],
      where: { username }
    }).then((user) => {
      if (user != null) {//&& user instanceof User
        var res = user.validPassword(password);
        if (!res)
          return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
      }
      else { return done('error'); }
    }).catch(() => done(null, false, { message: 'Incorrect username.' }));
  }
));

module.exports = app;
