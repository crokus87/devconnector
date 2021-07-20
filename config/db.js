// import required modules and config values
const mongoose = require('mongoose');

// mongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
