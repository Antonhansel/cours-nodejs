const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { getIoInstance } = require('../socketHandler/index');

// const DONE = 'DONE';
// const TODO = 'TODO';

const itemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    required: true,
  },
  doer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  todoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
  },
});


/**
 * Todo Schema
 */
const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  users: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  list: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    }],
  },
});


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
TodoSchema.method({
});

/**
 * Statics
 */
TodoSchema.statics = {
  /**
   * Get todo
   * @param {ObjectId} id - The objectId of todo.
   * @returns {Promise<Todo, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((todo) => {
        if (todo) {
          return todo;
        }
        const err = new APIError('No such todo exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List todos in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of todos to be skipped.
   * @param {number} limit - Limit number of todos to be returned.
   * @returns {Promise<Todo[]>}
   */
  list({ skip = 0, limit = 50 } = {}, userId) {
    return this.find({
      $or: [{
        users: userId,
      }, {
        author: userId,
      }],
    })
      .populate({ path: 'list users author' })
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  toJson(todo) {
    let doneCount = 0;
    return {
      id: todo._id,
      name: todo.name,
      author: todo.author,
      createdAt: todo.createdAt,
      shortId: todo.shortId,
      users: todo.users,
      list: todo.list.map((item) => {
        if (item.status === 'DONE') {
          doneCount += 1;
        }
        return ({
          id: item._id,
          author: item.author,
          text: item.text,
          status: item.status,
          doer: item.doer,
          todoId: item.todoId,
        });
      }),
      done: doneCount,
      total: todo.list.length,
    };
  },
};

itemSchema.statics = {
  toJson(item) {
    return ({
      id: item._id,
      author: item.author,
      text: item.text,
      status: item.status,
      doer: item.doer,
      todoId: item.todoId,
    });
  },
};

const TodoModel = mongoose.model('Todo', TodoSchema);
const ItemModel = mongoose.model('Item', itemSchema);

itemSchema.pre('save', async function preItemSchemaSave(next) {
  try {
    const populated = await ItemModel.populate(this, { path: 'author doer' });
    getIoInstance().to(this.todoId).emit('update', { type: 'item', data: ItemModel.toJson(populated) });
    console.log('Update emitted for itemschema');
  } catch (e) {
    return next(e);
  }
  return next();
});

TodoSchema.pre('save', async function preTodoSchemaSave(next) {
  try {
    const populated = await TodoModel.populate(this, { path: 'list users author' });
    getIoInstance().to(this._id).emit('update', { type: 'todo', data: TodoModel.toJson(populated) });
    console.log('Update emitted for todoschema!');
  } catch (e) {
    return next(e);
  }
  return next();
});

/**
 * @typedef Todo
 */
module.exports = TodoModel;
