var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');
var rateLimit = require("express-rate-limit");
// var csurf = require('csurf')
var helmet = require('helmet')
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('./jwt');
var multer = require('multer');
var upload = multer();
var createError = require('http-errors');

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
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "replace secret key in production",
  name: "SessionIdValue",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 } // todo: replace in production
}));
app.use(upload.array());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', './images/dastbedast.svg')));
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
  passport.authenticate('local', { session: false, failureRedirect: '/error' }),
  (req, res) => {
    if (req.is('application/json')) {
      var payload = req.user.jwtPayload();
      var token = jwt.sign(payload);
      res.json({ message: "ok", token });
    }
    else
      res.redirect('/user/' + req.user.id)
  }
);
// Authorization: Bearer token
app.post('/jwt',
  passport.authenticate('jwt', { session: true }),
  (req, res) => {
    if (req.is('application/json'))
      res.json({ login: "ok" });
    else
      res.redirect('/user/' + req.user.id)
  }
);

app.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    req.session.destroy();
    if (req.is('application/json'))
      res.json({ logout: "ok" });
    else
      res.redirect('/');
  }
  else
    res.status(401).json({ msg: "login first" });
});

app.get('/api/list', (req, res) => {
  const listEndpoints = require('express-list-endpoints')
  res.send(listEndpoints(app));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(res.locals);
});

// passport config
var User = require('./models').User;
passport.serializeUser(User.passportSerialize);
passport.deserializeUser(User.passportDeserialize);
passport.use(new LocalStrategy(User.passportLogin));
passport.use(new JwtStrategy(jwt.options, User.passportJwt));

module.exports = app;
