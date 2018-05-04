require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const passport = require('passport');
const OAuthStrategy = require('passport-oauth').OAuthStrategy;
const tumblr = require('tumblr.js');

const PORT = process.env.PORT || 8080;

let client;

passport.use('tumblr', new OAuthStrategy(
  {
    requestTokenURL: 'https://www.tumblr.com/oauth/request_token',
    userAuthorizationURL: 'https://www.tumblr.com/oauth/authorize',
    accessTokenURL: 'https://www.tumblr.com/oauth/access_token',
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (token, tokenSecret, profile, done) => {
    client = tumblr.createClient({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      token: token,
      token_secret: tokenSecret
    });
    client.userInfo((err, resp) => {
      return done(null, resp.user);
    });
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

app.use(express.static('static/assets'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'sup', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/tumblr', 
  passport.authenticate('tumblr')
);

app.get(
  '/auth/tumblr/callback',
  passport.authenticate('tumblr', { successRedirect: '/', failureRedirect: '/login' })
);

app.get(
  '/api/dashboard',
  (req, res) => {
    client.userDashboard({
      limit: req.query.limit,
      offset: req.query.offset
    }, (err, resp) => {
      res.send(resp);
    });
  }
);

app.post(
  '/api/reblog',
  (req, res) => {
    client.reblogPost(
      req.user.name, 
      {
        id: req.query.id,
        reblog_key: req.query.reblog_key
      }, 
      (err, resp) => {
        res.send(resp);
      }
    );
  }
);

app.post(
  '/api/like',
  (req, res) => {
    client.likePost(
      req.query.id,
      req.query.reblog_key, 
      (err, resp) => {
        res.send(resp);
      }
    );
  }
);

app.post(
  '/api/unlike',
  (req, res) => {
    client.likePost(
      req.query.id,
      req.query.reblog_key, 
      (err, resp) => {
        res.send(resp);
      }
    );
  }
);

app.get(
  '/', 
  ensureAuthenticated,
  (req, res) => {  
    res.sendFile(path.join(__dirname + '/static/dashboard.html'));
  }
);

app.get(
  '/login', 
  (req, res) => {  
    res.sendFile(path.join(__dirname + '/static/login.html'));
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.listen(PORT, () => console.log(`Tumblr Dash listening on port ${PORT}`));
