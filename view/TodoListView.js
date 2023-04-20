class TodoListView {

    static CLASS_DONE = '.done'
    static TODO_ITEM = '.todoItem'
    static DELETE_BTN = '.deleteBtn'
    static EDIT_BTN = '.editBtn'

    constructor(options) {
        this.$listEl = this.init()
        this.options = options
    }

    init() {
        return $(`<div class="todo"><ul id="todoList"></ul></div>`)
            .on('click', TodoListView.DELETE_BTN, this.onDelBtnClick.bind(this))
            .on('click', TodoListView.EDIT_BTN, this.onEditBtnClick.bind(this))
            .on('click', TodoListView.TODO_ITEM, this.onTodoItemClick.bind(this))
    }

    onDelBtnClick(e) {
        e.stopPropagation()
        const id = this.getTodoElId(e.target)

        this.options.onDelete(id)
    }

    onEditBtnClick(e) {
        e.stopPropagation()
        const id = this.getTodoElId(e.target)

        this.options.onEdit(id)
    }

    onTodoItemClick(e) {
        const id = this.getTodoElId(e.target)

        this.options.onToggle(id)
        console.log(id);
    }

    getTodoElId(el) {
        return el.closest(TodoListView.TODO_ITEM).dataset.id
    }

    appendTo($el) {
        $el.append(this.$listEl);

    }

    renderTodoList(list) {
        const html = list.map(this.genTodoHtml).join('')

        this.$listEl.html(html)
    }

    replaceTodo(id, todo) {
        const oldTodoEl = this.$listEl.find(`[data-id="${id}"]`)
        const newTodoEl = this.genTodoHtml(todo)

        oldTodoEl.replaceWith(newTodoEl)
    }

    writeTodo(todo) {

        const html = this.genTodoHtml(todo)

        this.$listEl.append(html)
    }

    genTodoHtml(todo) {
        const done = todo.done ? ' done' : ''
        return `
            <li
                class="todoItem${done}"
                data-id="${todo.id}"
            >
                <span>${todo.message}</span>
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            </li>`;
    }

    removeTodo(id) {
        this.$listEl.find(`[data-id="${id}"]`).remove()
    }
}