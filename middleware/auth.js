// import required modules
const jwt = require('jsonwebtoken');

// setup middleware for authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!token) throw new Error(); // if there is no user throw an error

    req.user = decoded.user; // store the user so the handler doesn't have to keep checking
    next(); // ends the process and allows the program to continue
  } catch (err) {
    res.status(401).json({ msg: 'Token is not found' });
  }
};

//export the auth middleware
module.exports = auth;
