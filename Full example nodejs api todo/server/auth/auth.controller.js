const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');

const User = mongoose.model('User');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    const err = new APIError('User not found', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  bcrypt.compare(req.body.password, user.password, (err, match) => {
    if (match && !err) {
      const token = jwt.sign({
        username: user.username,
        id: user._id,
      }, config.jwtSecret);
      return res.json({
        token,
        username: user.username,
        todos: user.todos,
        id: user._id,
      });
    }
    const newErr = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(newErr);
  });
};

module.exports = { login };
