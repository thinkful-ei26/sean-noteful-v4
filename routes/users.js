'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', (req, res, next) => {
  const requiredFields = ['username', 'password'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error(`Missing \`${field}\` in request body`);
      err.status = 400;
    }
  });
  const {fullname, username, password} = req.body;
  const newUser = {fullname, username};

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
