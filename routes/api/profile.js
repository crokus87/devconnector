// import required modules
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');

// create express router
const router = express.Router();

// @route   GET api/profile/me (current user profile)
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // get the user's profile, populating it with their name and avatar
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/profile/
// @desc    Create or update user's profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Sills is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    // display errors if they exist
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // setup the profile object and associate it with the user
    const { skills, youtube, twitter, facebook, linkedin, instagram } =
      req.body;
    const profileFields = {
      ...req.body,
      user: req.user.id,
      skills: skills.split(',').map((skill) => skill.trim()),
      social: { youtube, twitter, facebook, linkedin, instagram }
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // check if user has an existing profile
      if (profile) {
        // update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create new profile
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/profile/
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
