// import required modules
const express = require('express');

// create express router
const router = express.Router();

// @route   GET api/posts
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Post route'));

module.exports = router;
