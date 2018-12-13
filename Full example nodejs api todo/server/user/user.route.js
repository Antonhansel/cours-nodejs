const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/me')
  /** GET /api/users/:userId - Get user */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.updateUser), userCtrl.update);

/** DELETE /api/users/:userId - Delete user */
// .delete(userCtrl.remove);

// /** Load user when API with userId route parameter is hit */
// router.param('userId', expressJwt({ secret: config.jwtSecret }), userCtrl.load);

// router.route('/todo')
//   /** POST /api/users/todo - Add todo to user */
// .post(expressJwt({ secret: config.jwtSecret }),
// validate(paramValidation.addTodoToUser), userCtrl.addTodoToUser);


module.exports = router;
