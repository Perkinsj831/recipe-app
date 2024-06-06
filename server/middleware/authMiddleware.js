const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);  // Log the authorization header

  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);  // Log the extracted token

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);  // Log the decoded token
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);  // Log the error
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = { verifyToken };
