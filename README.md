# Passport-Gumroad

[![npm version](https://badge.fury.io/js/passport-gumroad.svg)](http://badge.fury.io/js/passport-gumroad)
[![Build Status](https://travis-ci.org/SamyPesse/passport-gumroad.svg?branch=master)](https://travis-ci.org/SamyPesse/passport-gumroad)

[Passport](http://passportjs.org/) strategy for authenticating with [Gumroad](https://www.gumroad.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Gumroad in your Node.js applications.
By plugging into Passport, Gumroad authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```
$ npm install passport-gumroad
```

## Usage

#### Configure Strategy

The Gumroad authentication strategy authenticates users using a Gumroad account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

```js
passport.use(new GumroadStrategy({
    clientID: GUMROAD_CLIENT_ID,
    clientSecret: GUMROAD_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/gumroad/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ gumroadId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'gumroad'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/gumroad',
  passport.authenticate('gumroad'));

app.get('/auth/gumroad/callback',
  passport.authenticate('gumroad', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```
