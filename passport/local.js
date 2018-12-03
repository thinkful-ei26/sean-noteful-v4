'use strict';

const {Strategy: LocalStrategy} = require('passport-local');
const User = require('../models/user');

const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User.findOne({username})
    .then(result => {
      user = result;
      if (!user) return Promise.reject({
        reason: 'LoginError',
        message: 'Incorrect Username',
        location: 'username'
      });
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) return Promise.reject({
        reason: 'LoginError',
        message: 'Incorrect Password',
        location: 'password'
      });
      return done(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') return done(null, false);
      return done(err);
    });
});

module.exports = localStrategy;
