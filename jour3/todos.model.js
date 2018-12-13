const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});


const model = mongoose.model('Todo', TodoSchema);

module.exports = model;












const jwt = require('jsonwebtoken');


* POST /login -> paramètres: username & password

const testUser1 = {
    username: 'anto',
    password: 'coucou',
    id: 0
}

const token = jwt.sign(..., 'test')



let user = null;

try {
    user = jwt.verify(req.headers.authorization, 'test ')
} catch(e) {
    return res.send(401)
}














