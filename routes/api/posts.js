// import required modules
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// create express router
const router = express.Router();

// @route   Post api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  auth,
  check('text', 'Text is required').not().isEmpty(),
  async (req, res) => {
    // dispay any errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // store user data
      const user = User.findById(req.user.id).select('-password');

      // store new post data
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // sort by most recent post
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // only allow post owner to delete post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if user has already liked this post
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check that the user has not liked this post
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server error');
  }
});

// @route   Post api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  auth,
  checkObjectId('id'),
  check('text', 'Text is required').not().isEmpty(),
  async (req, res) => {
    // dispay any errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // store user data
      const user = User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      // store new comment data
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   Post api/posts/comment/:id
// @desc    Delete a commment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(401).json({ msg: 'Comment does not exist' });
    }

    // check that the user deleting the comment is the one who made it
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'User not authorized' });
    }

    await post.comments.remove(comment);

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
