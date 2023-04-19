class TodoFormView {
    constructor() {
        
    }
    
    appendTo($el) {
        $el.append(` 
    <form id="todoForm">
        <input id="id" type="hidden">
        <input class="input" id="msgInput" type="text" placeholder="Что нужно сделать?" />
        <button class="msgButton" id="msgButton">Отправить</button>
    </form>
    `)
    }
}


