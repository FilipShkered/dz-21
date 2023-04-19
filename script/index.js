const CLASS_TODO_ITEM = 'todoItem'
const CLASS_DONE = 'done'
const CLASS_DELETE_BTN = 'deleteBtn'
const CLASS_EDIT_BTN = 'editBtn'
const input = document.querySelector('#msgInput');
const form = document.querySelector('#todoForm')
const listEl = document.querySelector('#todoList');
const $root = $('#root')


form.addEventListener('submit', onFormSubmit)
listEl.addEventListener('click', onTodoListClick);
input.addEventListener('keydown', onInputKeyDown);

const todoCollection = new Collection()
// const todoFormView = new TodoFormView()
// const todoListView = new TodoListView()

// todoFormView.appendTo($rootEl)
// todoListView.appendTo($rootEl)




todoCollection.fetch().then(() => {
  renderTodoList(todoCollection.getList())
})

function onFormSubmit(e) {
  e.preventDefault()

  const todo = getData()

  if (!isTodoValid(todo)) {
    showError(new Error('Поле не может быть пустым'))
    return
  }

  if (todo.id) {
    
      todoCollection.update(todo.id, todo)
      .then((newTodo) => {
        replaceTodo(todo.id, newTodo)
        clearForm()
        
      })
      .catch(e => showError(e))
  } else {
    TodoApi
      .create(todo)
      .then((newTodo) => {
        writeTodo(newTodo)
        clearForm()

      })
      .catch((e) => {
        showError(e)
      })
  }
}

function onInputKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    onFormSubmit(e);
  }
}

function onTodoListClick(e) {
  const target = e.target
  const todoEl = findElem(target)

  if (!todoEl) {
    return
  }

  if (isDeleteBtn(target)) {
    delTodoElem(todoEl)
    return;
  } else if (isEditBtn(target)) {
    editTodo(todoEl)
    return;
  }

  todoDone(todoEl)
}

function isDeleteBtn(el) {
  return el.classList.contains(CLASS_DELETE_BTN)
}

function isEditBtn(el) {
  return el.classList.contains(CLASS_EDIT_BTN)
}

function findElem(el) {
  return el.closest('.' + CLASS_TODO_ITEM)
}

function getData() {
  const id = form.id.value
  const todo = findTodoById(id) || {} // undefined || {}

  return {
    ...todo,
    message: input.value,
  }
}


function delTodoElem(el) {
  const id = getTodoElId(el)

  todoCollection.delete(id).catch(e => showError(e))

  el.remove()
}


function todoDone(el) {
  const id = el.dataset.id;
  const isDone = el.classList.contains('done');
  const done = {
    done: !isDone
  };
  TodoApi.update(id, done)
    .then(() => {
      el.classList.toggle(CLASS_DONE);
    })
    .catch((e) => {
      showError(e);
    });
}

function editTodo(el) {
  const id = getTodoElId(el)
  const todo = findTodoById(id)

  fillForm(todo)
}

function isTodoValid(todo) {
  return todo.message !== ''
}

function showError(e) {
  alert(e.message)
}

function renderTodoList(list) {
  const html = list.map(genTodoHtml).join('')

  listEl.innerHTML = html

  const liElements = document.querySelectorAll('.todoItem')
  liElements.forEach((li) => {
    const todoId = li.dataset.id
    const todo = list.find((todo) => todo.id === todoId)
    if (todo.done) {
      li.classList.add('done')
    }
  })
}

function replaceTodo(id, todo) {
  const oldTodoEl = document.querySelector(`[data-id="${id}"]`)
  const newTodoEl = genTodoHtml(todo)

  oldTodoEl.outerHTML = newTodoEl
}

function writeTodo(todo) {

  const html = genTodoHtml(todo)

  listEl.insertAdjacentHTML('beforeend', html)
}

function genTodoHtml(todo) {
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

function clearForm() {
  form.reset()
}

function fillForm(todo) {
  form.id.value = todo.id
  input.value = todo.message
}

function getTodoElId (el) {
  return el.dataset.id
}

function findTodoById (id) {
  return todoCollection.find(id)
}