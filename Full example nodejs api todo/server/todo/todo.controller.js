const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ShortUniqueId = require('short-unique-id');
const APIError = require('../helpers/APIError');

const uid = new ShortUniqueId();

const User = mongoose.model('User');
const Todo = mongoose.model('Todo');
const Item = mongoose.model('Item');

/**
 * Get todo
 */
const get = async (req, res, next) => {
  let todo = null;
  if (req.params.todoId) {
    todo = await Todo.findOne({ _id: req.params.todoId }).populate({ path: 'list author users' });
  } else {
    todo = await Todo.findOne({ shortId: req.body.shortId }).populate({ path: 'list author users' });
  }
  if (!todo) {
    const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  return res.json(Todo.toJson(todo));
};

/**
 * Create new todo
 * @property {string} req.body.name - The name of todo.
 * @property {string} req.body.author - The author mongoId of the todo.
 */
const create = async (req, res, next) => {
  const user = await User.findOne({
    _id: req.user.id,
  });
  if (!user) {
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  const todo = new Todo({
    name: req.body.name,
    shortId: uid.randomUUID(5).toUpperCase(),
    author: mongoose.Types.ObjectId(req.user.id),
  });
  const savedTodo = await todo.save();
  const populatedTodo = await Todo.populate(savedTodo, { path: 'list author users' });
  res.json(Todo.toJson(populatedTodo));
};

/**
 * Update existing todo
 * @property {string} req.body.name - The name of todo.
 */
const update = async (req, res, next) => {
  const todo = await Todo.findOne({
    _id: req.params.todoId,
  });
  if (!todo) {
    const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  todo.name = req.body.name;
  const savedTodo = await todo.save();
  const populatedTodo = await Todo.populate(savedTodo, { path: 'list author users' });
  res.json(Todo.toJson(populatedTodo));
};

/**
 * Update todo content
 */
const addItem = async (req, res, next) => {
  const todo = await Todo.findOne({
    _id: req.params.todoId,
  });
  if (!todo) {
    const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  const item = new Item({
    text: req.body.text,
    author: req.user.id,
    status: 'TODO',
    todoId: req.params.todoId,
  });
  const savedItem = await item.save();
  todo.list.push(savedItem._id);
  const savedTodo = await todo.save();
  const populatedTodo = await Todo.populate(savedTodo, { path: 'list author users' });
  res.json(Todo.toJson(populatedTodo));
};

/**
 * Remove item from todo
 */
const removeItem = async (req, res, next) => {
  try {
    await Item.remove({
      _id: req.params.itemId,
    });
    const populatedTodo = await Todo.findOne({ _id: req.params.todoId }).populate({ path: 'list author users' });
    res.json(Todo.toJson(populatedTodo));
  } catch (e) {
    return next(e);
  }
};

/**
 * Update todo item
 */
const updateItem = async (req, res, next) => {
  const item = await Item.findOne({
    _id: req.params.itemId,
  });
  if (!item) {
    const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  if (req.body.text) {
    item.text = req.body.text;
  }
  if (req.body.status) {
    item.status = req.body.status;
  }
  await item.save();
  const populatedTodo = await Todo.findOne({ _id: req.params.todoId }).populate({ path: 'list author users' });
  res.json(Todo.toJson(populatedTodo));
};

/**
 * Update existing todo
 * @property {string} req.body.shortId - The shortId of the todo.
 */
const addUserWithShortId = async (req, res, next) => {
  const todo = await Todo.findOne({
    shortId: req.body.shortId,
  });
  if (!todo) {
    const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  if (todo.users.indexOf(req.user.id) === -1) {
    todo.users.push(req.user.id);
  }
  todo.save()
    .then((savedTodo) => {
      res.json(Todo.toJson(savedTodo));
    })
    .catch(e => next(e));
};

/**
 * Get todo list.
 * @property {number} req.query.skip - Number of todos to be skipped.
 * @property {number} req.query.limit - Limit number of todos to be returned.
 * @returns {Todo[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Todo.list({ limit, skip }, req.user.id)
    .then((todos) => {
      res.json(todos.map(todo => Todo.toJson(todo)));
    })
    .catch(e => next(e));
}

/**
 * Delete todo.
 * @returns {Todo}
 */
function remove(req, res, next) {
  const { todo } = req;
  todo.remove()
    .then(deletedTodo => res.json(Todo.toJson(deletedTodo)))
    .catch(e => next(e));
}

module.exports = {
  get, create, update, list, remove, addUserWithShortId, addItem, removeItem, updateItem,
};
