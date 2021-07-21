// import required modules
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// create the User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  token: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// setup method to generate token when a user logs in
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const payload = {
    user: {
      id: user.id
    }
  };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '1h'
  };
  const token = jwt.sign(payload, secret, options);

  // add token to user's current tokens
  user.token = token;

  //save user and return the token
  await user.save();
  return token;
};

// store the user model
const User = mongoose.model('user', UserSchema);

module.exports = User;
