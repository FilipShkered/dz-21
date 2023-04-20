class TodoFormView {
    constructor(options) {
        this.$form = this.init()
        this.$inputs = this.$form.find('input')
        this.options = options
    }

    init() {
        return $(`<form id="todoForm">
        <input id="id" type="hidden">
        <input class="input" id="message" type="text" placeholder="Что нужно сделать?" />
        <button class="msgButton" id="msgButton">Отправить</button>
    </form>`)

            .on('submit', this.onFormSubmit.bind(this))


    }

    onFormSubmit(e) {
        e.preventDefault()

        const data = this.getData()

        if (!this.isTodoValid(data)) {
            this.showError(new Error('Поле не может быть пустым'))
            return
        }

        this.options.onSubmit(data)
    }


    isTodoValid(todo) {
        return todo.message !== ''
    }


    appendTo($el) {
        $el.append(this.$form)
    }

    getData() {

        const data = {};

        for (const input of this.$inputs) {
            data[input.id] = input.value;
            
        }
        return data
    }

    setData(data) {

        for (const input of this.$inputs) {
            input.value = data[input.id];

            console.log(data);
        }

    }

    clearData() {
        for (const input of this.$inputs) {
            input.value = ''
        }
    }

    showError(error) {
        alert(error.message)
    }

}