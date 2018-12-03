'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const localAuth = passport.authenticate('local', {session: false, failWithError: true});

router.post('/login', localAuth, (req, res) => res.json(req.user));

module.exports = router;
