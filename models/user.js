'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: String,
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

userSchema.methods.validatePassword = function(incommingPassword) {
  return bcrypt.compare(incommingPassword, this.password);
};

userSchema.statics.hashPassword = function(incommingPassword) {
  return bcrypt.hash(incommingPassword, 10);
};

module.exports = mongoose.model('User', userSchema);
