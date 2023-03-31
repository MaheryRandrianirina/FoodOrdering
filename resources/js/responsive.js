export default class Responsive {
    constructor()
    {
        this.header = document.querySelector('header')
        this.html = document.querySelector('html')
        this.header.style.width = this.html.clientWidth + 'px'
        
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize()
    {
        this.header.style.width = this.html.clientWidth + 'px'

        let modalContainer = document.querySelector('.modal-container')
        if(modalContainer !== null){
            modalContainer.style.width = this.html.clientWidth + "px"
        }
    }
}