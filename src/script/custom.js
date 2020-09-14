class Author extends HTMLElement {
    constructor() {
        super();
        this.text = this.getAttribute('text') || null;

        this.innerHTML = `
       <h3>${this.text}</h3>
       `
    }
}
customElements.define('author-name', Author);