const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
    },
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
    },
    params: {
      userId: Joi.string().hex().required(),
    },
  },

  // UPDATE /api/users/:userId
  addTodoToUser: {
    body: {
      shortId: Joi.string().required(),
      deviceId: Joi.string().required(),
    },
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  },

  // POST /api/todos
  createTodo: {
    body: {
      name: Joi.string().required(),
    },
  },
  // UPDATE /api/todos/:todoId
  updateTodo: {
    body: {
      name: Joi.string().required(),
    },
  },

  addItem: {
    body: {
      text: Joi.string().required(),
    },
  },
  updateItem: {
    body: {
      text: Joi.string(),
      status: Joi.string(),
    },
  },

  list: {
  },
  addUserWithShortId: {
    body: {
      shortId: Joi.string().required(),
    },
  },
};
