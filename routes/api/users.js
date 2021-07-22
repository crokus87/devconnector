// import required modules
const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// create express router
const router = express.Router();

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 }) // may want to add stricter rules for passports
  ],
  async (req, res) => {
    // variables to store errors or provided data
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    // check for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check if user already exists to prevent duplicate users
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // get user's gravatar (profile pic associated with their email)
      const avatar = gravatar.url(email, {
        s: '200', // size in pixels
        r: 'pg', // rating level of pictur allowed
        d: 'mm' // default image if user has no gravatar
      });

      // create the user
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // encrypt the password using bcrypt
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // save the user
      await user.save();

      // return jsonwebtoken -> logs the user in
      const token = await user.generateAuthToken();

      res.status(201).send({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
