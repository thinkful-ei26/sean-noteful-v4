'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', (req, res, next) => {
  const requiredFields = ['username', 'password'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error(`Missing \`${field}\` in request body`);
      err.status = 422;
      return next(err);
    }
  });
  const stringFields = ['fullname', 'username', 'password'];
  stringFields.forEach(field => {
    if (field in req.body && typeof req.body[field] !== 'string') {
      const err = new Error(`Incorrect field type for \`${field}\`: expected string`);
      err.status = 422;
      return next(err);
    }
  });
  const trimmedFields = ['username', 'password'];
  trimmedFields.forEach(field => {
    if (req.body[field].trim() !== req.body[field]) {
      const err = new Error(`Cannot start or end \`${field}\` with whitespace`);
      err.status = 422;
      return next(err);
    }
  });
  const sizedFields = {
    username: {min: 1},
    password: {min: 8, max: 72}
  };
  Object.keys(sizedFields).forEach(field => {
    let err;
    if ('min' in sizedFields[field] && req.body[field].length < sizedFields[field].min) {
      err = new Error(`\`${field}\` must be at least ${sizedFields[field].min} characters`);
    } else if ('max' in sizedFields[field] && req.body[field].length > sizedFields[field].max) {
      err = new Error(`\`${field}\` must be at most ${sizedFields[field].max} characters`);
    }
    if (err) {
      err.status = 422;
      return next(err);
    }
  });
  const {fullname, username, password} = req.body;
  const newUser = {fullname: fullname.trim(), username};

  return User.hashPassword(password)
    .then(digest => {
      newUser.password = digest;
      return User.create(newUser);
    })
    .then(result => res.location(`${req.originalUrl}/${result.id}`).status(201).json(result))
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;
