const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const checkAdmin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Debugging: Log the token and _id
    console.log('Token:', token);
    const { _id } = jwt.verify(token, process.env.SECRET);
    console.log('_id:', _id);

    const user = await User.findOne({ _id: _id });

    // Check if user is admin
   if ( user && user.role === 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Only admins are allowed' });
    }

    next();
  } catch (error) {
    console.error('Error in checkAdmin middleware:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = checkAdmin;
