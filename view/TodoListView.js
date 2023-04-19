class TodoListView {

    constructor() {

    }

    appendTo($el) {
        $el.appeend(`
        <div class="todo">
        <ul id="todoList"></ul>
        </div>`)
    }
}