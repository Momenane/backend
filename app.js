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
var groupRouter = require('./routes/groups');
var memberRouter = require('./routes/members');
var donateRouter = require('./routes/donates');
var planRouter = require('./routes/plans');

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
  cookie: { secure: false, maxAge: 3600000 } // todo: replace in production
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
app.use('/register', userLimiter);
app.use('/login', userLimiter);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/group', groupRouter);
app.use('/member', memberRouter);
app.use('/donate', donateRouter);
app.use('/plan', planRouter);

// { successRedirect: '/' }
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/error' }),
  (req, res) => {
    // res.json(req.user);
    res.redirect('/user/get/' + req.user.id);
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.json({ "logout": "ok" });
});

// passport config
var User = require('./models').User;
passport.serializeUser(User.passportSerialize);
passport.deserializeUser(User.passportDeserialize);
passport.use(new LocalStrategy(User.passportLogin));

module.exports = app;
