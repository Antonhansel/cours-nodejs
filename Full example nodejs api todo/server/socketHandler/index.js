const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../../config/config');

let globalIo = null;

const socketHandler = (io) => {
  const Todo = mongoose.model('Todo');
  globalIo = io;
  io.on('connection', (socket) => {
    socket.emit('hello');
    // Subscribe event
    // data: {
    //   todoId
    // }
    socket.on('subscribe', (data) => {
      console.log('data', data);
      let jsonData = data;
      try {
        if (!jsonData.token) {
          jsonData = JSON.parse(data);
        }
        if (jsonData.token) {
          jwt.verify(jsonData.token, config.jwtSecret, async (err, decoded) => {
            if (!err) {
              const todo = await Todo.findOne({ _id: mongoose.Types.ObjectId(jsonData.todoId) });
              if (todo && (String(todo.author) === decoded.id || todo.users.indexOf(decoded.id) > -1)) {
                socket.join(todo._id);
                socket.emit('subscribed');
                console.log('subscribed');
                return;
              }
            }
            socket.emit('error', 'error when subscribing: wrong todo id');
          });
        }
      } catch (e) {
        console.log(e);
        socket.emit('error', 'error when parsing json');
      }
    });
  });
};

const getIoInstance = () => globalIo;

module.exports = { socketHandler, getIoInstance };
