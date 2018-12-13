# Jour 3

## Objectifs

* Nouveau dossier
* installer express, nodemon, body-parser
* instancier et configurer express, ecouter sur le port 3000
* GET /todos -> renvoyer un []
* POST /todos -> Afficher les parametres envoyés dans le formulaire
* Dans le formulaire POST /todos envoyer {text: "text de la toudou"}
* installer mongoose
* installer MongoDB
* POST /todos

```

en haut du fichier
const Todo = mongoose.model('Todo');


dans le post
const todo = new Todo({
    text: req.body.text
});
await todo.save();
res.send(todo);
```

* Dans GET /todos
* renvoyer le resultat de -> await Todo.find({});

* GET /todos/:todoId
* Renvoyer une todo demandée par son id
* app.get('/todos/:todoId, async (req, res) => {
    const todo = await Todo.findOne({_id: req.params.todoId});
    res.send(todo)
});

* DEL /todos/:todoID app.delete
    Todo.remove()
