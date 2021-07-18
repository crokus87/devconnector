// import required modules
const express = require('express');
const connectDB = require('./config/db');

// variables to store express
const app = express();

// connect to the mogoDB database
connectDB();

// test request to see if the api is running
app.get('/', (req, res) => res.send('API Running'));

// define routes -> may move import statements into variables at the top and replace require() with variable name
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// variable to store the port data
const PORT = process.env.PORT || 5000;

// setup express server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
