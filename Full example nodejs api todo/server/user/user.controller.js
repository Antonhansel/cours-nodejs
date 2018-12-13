const mongoose = require('mongoose');
const httpStatus = require('http-status');

const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const APIError = require('../helpers/APIError');

/**
 * Get user
 * @returns {User}
 */
const get = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    return res.json(user);
  } catch (e) {
    return next(e);
  }
};

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
const create = async (req, res, next) => {
  const previousUser = await User.findOne({ username: req.body.username });
  if (previousUser) {
    const err = new APIError('User already exists!', httpStatus.CONFLICT, true);
    next(err);
  }

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });
    user.save()
      .then((savedUser) => {
        const token = jwt.sign({
          username: savedUser.username,
          id: savedUser._id,
        }, config.jwtSecret);
        res.json({
          username: savedUser.username,
          id: savedUser._id,
          createdAt: savedUser.createdAt,
          token,
        });
      })
      .catch(e => next(e));
  });
};

/**
 * Update existing user
 * @returns {User}
 */
function update(req, res, next) {
  const user = User.findOne({ _id: req.user.id });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 */
function remove(req, res, next) {
  const { user } = req;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = {
  get, create, update, list, remove,
};
