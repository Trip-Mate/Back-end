const jwt = require('jsonwebtoken');
const config = require('../config/app');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  // console.log('AUTH: ', req.body.user)

  if (!token) {
    return res.status(401).json({
      msg: 'No token, authorization denied',
    });
  }

  try {
    const decoded = jwt.decode(token, config.secret);
    req.body = { ...decoded.user, ...req.body.user }

    console.log( 'DECODED: ', req.body)
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
