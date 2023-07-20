const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    // Aw, mailoji users are blocked - https://mailoji.com/
    //
    // Regex parsing for emails is fraught! Consider sending validation emails
    // instead.
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      'Please provide valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    match: [
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*])(?=.{8,})/,
      'Passwords must have at least 8 characters with at least one lower case letter, at least one upper case letter, at least one number, and at least one of the characters !@#$&*.',
    ],
  },
});

// Encrypt password before saving
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  // `await has no effect on this expression`, my editor tells, me! Two things;
  //
  // 1. try to setup your editor to tell you these things! (I don't use VS Code, so I can't give any more specific help unfortunately)
  // 2. do not await synchronous functions!
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
