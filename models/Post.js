// import required files
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create the Post Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, // link the user to the post
    ref: 'user'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String // user's name
  },
  avatar: {
    type: String // user's avatar
  },
  likes: [
    // array of 'likes' objects a post recieves
    {
      user: {
        type: Schema.Types.ObjectId, // link the user who liked the post
        ref: 'user'
      }
    }
  ],
  comments: [
    // array of 'comments' on a post
    {
      user: {
        type: Schema.Types.ObjectId, // link the user who commented
        ref: 'user'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String // name of user who commented
      },
      avatar: {
        type: String // avatar of user who commented
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

// store the post model
const Post = mongoose.model('post', PostSchema);

module.exports = Post;
