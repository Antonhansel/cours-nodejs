const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const todoCtrl = require('./todo.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/todos - Get list of todos */
  .get(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.list), todoCtrl.list)

  /** POST /api/todos - Create new todo */
  .post(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.createTodo), todoCtrl.create);

router.route('/:todoId')
  /** GET /api/todos/:todoId - Get todo */
  .get(expressJwt({ secret: config.jwtSecret }), todoCtrl.get)

  /** PUT /api/todos/:todoId - Update todo */
  .put(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.updateTodo), todoCtrl.update)

  /** DELETE /api/todos/:todoId - Delete todo */
  .delete(expressJwt({ secret: config.jwtSecret }), todoCtrl.remove);

router.route('/:todoId/items')
  .post(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addItem), todoCtrl.addItem);

router.route('/:todoId/items/:itemId')
  .put(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.updateItem), todoCtrl.updateItem)

  .delete(expressJwt({ secret: config.jwtSecret }), todoCtrl.removeItem);

router.route('/add')
  /** DELETE /api/todos/add - Add todo with short id */
  .post(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addUserWithShortId), todoCtrl.addUserWithShortId);

module.exports = router;
