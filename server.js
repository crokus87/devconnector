// import required modules
const express = require('express');

// variables to store express
const app = express();

app.get('/', (req, res) => res.send('API Running'));

// variable to store the port data
const PORT = process.env.PORT || 5000;

// setup express server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));