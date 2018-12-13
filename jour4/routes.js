const mongoose = require('mongoose');
const Todo = mongoose.model('Todo');

const routeHandler = (app) => {
    app.post('/todos', async (req, res, next) => {
        console.log(req.body);
        const todo = new Todo({
            text: req.body.text
        });
        const savedTodo = await todo.save();
        res.send(savedTodo);
    });
    app.get('/todos', async (req, res, next) => {
        const todos = await Todo.find({});
        res.send(todos);
    });
    app.delete('/todos/:todoId', async (req, res, next) => {
        await Todo.remove({_id: req.params.todoId});
        res.send(200)
    });
}

module.exports = routeHandler;