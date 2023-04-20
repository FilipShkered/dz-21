class Controller {
    
    constructor($rootEl) {

        this.todoCollection = new Collection()
        this.todoFormView = new TodoFormView({
                onSubmit: this.save.bind(this)
            }),
            this.todoListView = new TodoListView({
                onDelete: this.delTodoElem.bind(this),
                onEdit: (id) => {
                    const todo = this.todoCollection.find(id)

                    this.todoFormView.setData(todo)
                },
                onToggle: this.todoDone.bind(this)
            })

        this.todoFormView.appendTo($rootEl)
        this.todoListView.appendTo($rootEl)




        this.todoCollection.fetch().then(() => {
            this.todoListView.renderTodoList(this.todoCollection.getList())
        })
    }

    save(todo) {
        if (todo.id) {

            this.todoCollection.update(todo.id, todo)
                .then((newTodo) => {
                    this.todoListView.replaceTodo(todo.id, newTodo)
                    this.todoFormView.clearData()

                })
                .catch(e => showError(e))
        } else {
            TodoApi
                .create(todo)
                .then((newTodo) => {
                    this.todoListView.writeTodo(newTodo)
                    this.todoFormView.clearData()

                })
                .catch((e) => {
                    showError(e)
                })
        }
    }


    delTodoElem(id) {
        this.todoCollection.delete(id).catch(e => showError(e))

        this.todoListView.removeTodo(id)
    }

   todoDone(id) {
    const todo = this.todoCollection.find(id)
    if (todo) {
        todo.done = !todo.done

        this.todoCollection
            .update(id, todo)
            .catch(e => this.showError(e))

        this.todoListView.replaceTodo(id, todo)
    } else {
        console.error(`Todo item with ID ${id} not found.`)
    }
}


    showError(e) {
        alert(e.message)
    }
}