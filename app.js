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
var createError = require('http-errors');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var multer = require('multer');
var upload = multer();

const jwt = require('./jwt');
var User = require('./models').User;

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

// Authorization: Bearer token
var jwtAuth = passport.authenticate('jwt', { session: false })

app.use('/', require('./routes/index'));
app.use('/user', jwtAuth, require('./routes/users'));
app.use('/group', jwtAuth, require('./routes/groups'));
app.use('/member', jwtAuth, require('./routes/members'));
app.use('/donate', jwtAuth, require('./routes/donates'));
app.use('/plan', jwtAuth, require('./routes/plans'));

app.post('/register', (req, res, next) => {
  // check for input data and validate constraint
  req.body.salt = User.newSalt();
  req.body.password = User.getStorePassword(req.body.password, req.body.salt);
  // req.body.role = perm.GroupAdmin;
  // todo: check role not is 'Admin'
  // todo: validate password format
  jwtAuth(req,res);
  if (req.isAuthenticated())
    return res.json({ message: "first logout" });
  const isJson = req.is('application/json');
  User.create(req.body)
    .then(user => {
      req.login(user, (err) => {
        if (err) next(err);
        else if (isJson) {
          var payload = user.jwtPayload();
          var token = jwt.sign(payload);
          res.status(201).json({ message: "ok", token: token });
        }
        else
          res.redirect('/user/id/' + user.id);
      });
    })
    .catch(error => res.status(400).json({ error: 'insert error', msg: error }));
});

// { successRedirect: '/' }
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/error' }),
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

app.all('/jwt', jwtAuth,
  (req, res) => {
    res.json({ login: "ok", id: req.user.id });
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
passport.serializeUser(User.passportSerialize);
passport.deserializeUser(User.passportDeserialize);
passport.use(new LocalStrategy(User.passportLogin));
passport.use(new JwtStrategy(jwt.options, User.passportJwt));

module.exports = app;
