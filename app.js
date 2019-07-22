const path = require('path');
const express = require('express');
const tumblr = require('tumblr.js');
const passport = require('passport');
const OAuthStrategy = require('passport-oauth').OAuthStrategy;

require('dotenv').config();
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

passport.use('tumblr', new OAuthStrategy({
    requestTokenURL: 'https://www.tumblr.com/oauth/request_token',
    accessTokenURL: 'https://www.tumblr.com/oauth/access_token',
    userAuthorizationURL: 'https://www.tumblr.com/oauth/authorize',
    consumerKey: CONSUMER_KEY,
    consumerSecret: CONSUMER_SECRET,
    callbackURL: CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    client = tumblr.createClient({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      token: token,
      token_secret: tokenSecret
    });
    client.userInfo((err, resp) => {
      return done(null, resp.user);
    });
  }
));

passport.serializeUser(function(user, callback) {
  callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
});

const app = express();

app.use(express.static('static/assets'));
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/tumblr', passport.authenticate('tumblr'));
app.get('/auth/tumblr/callback', 
  passport.authenticate('tumblr', { successRedirect: '/', failureRedirect: '/login' }),
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

app.get(
  '/api/dashboard',
  (req, res) => {
    client.userDashboard(
      req.query, 
      (err, resp) => { res.send(resp); }
    );
  }
);

app.post(
  '/api/reblog',
  (req, res) => {
    client.reblogPost(
      req.user.name, 
      req.query, 
      (err, resp) => { res.send(resp); }
    );
  }
);

app.post(
  '/api/like',
  (req, res) => {
    client.likePost(
      req.query.id,
      req.query.reblog_key, 
      (err, resp) => { res.send(resp); }
    );
  }
);

app.post(
  '/api/unlike',
  (req, res) => {
    client.likePost(
      req.query.id,
      req.query.reblog_key, 
      (err, resp) => { res.send(resp); }
    );
  }
);

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*
require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const passport = require('passport');
const OAuthStrategy = require('passport-oauth').OAuthStrategy;
const tumblr = require('tumblr.js');
const browserSync = require('browser-sync');

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
    client.userDashboard(
      req.query, 
      (err, resp) => { res.send(resp); }
    );
  }
);

app.post(
  '/api/reblog',
  (req, res) => {
    client.reblogPost(
      req.user.name, 
      req.query, 
      (err, resp) => { res.send(resp); }
    );
  }
);

app.post(
  '/api/like',
  (req, res) => {
    client.likePost(
      req.query.id,
      req.query.reblog_key, 
      (err, resp) => { res.send(resp); }
    );
  }
);

app.post(
  '/api/unlike',
  (req, res) => {
    client.likePost(
      req.query.id,
      req.query.reblog_key, 
      (err, resp) => { res.send(resp); }
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

const isProduction = process.env.NODE_ENV === 'production';
app.listen(PORT, () => { 
  console.log(`Tumblr Dash listening on port ${PORT}`);
  if(!isProduction) {
    // https://ponyfoo.com/articles/a-browsersync-primer#inside-a-node-application
    browserSync({
      
      online: false,
      open: false,
      port: PORT + 1,
      proxy: 'localhost:' + PORT,
      ui: false
    });
  }
    
});
*/
