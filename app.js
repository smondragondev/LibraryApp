const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const createError = require('http-errors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { origin } = require('./src/config/core.config');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, CALLBACK_URL } = require('./src/config/github.config');

dotenv.config();

const app = express();
const db = require('./src/models');

const store = new MongoDBStore({
  uri: db.url,
  collection: 'sessions'
});

var corsOptions = { origin: origin };
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// AUTH ROUTES
app.get('/', (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.username}`
      : 'Logged Out'
  );
});

app.get('/login', passport.authenticate('github'), () => {});

app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// API ROUTES
app.use('/', require('./src/routes'));

// 404 handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});


module.exports = app;