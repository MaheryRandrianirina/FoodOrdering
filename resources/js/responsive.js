export default class Responsive {
    constructor()
    {
        this.html = document.querySelector('html')
        this.modalContainer = document.querySelector('.modal-container')
        if(this.modalContainer){
            window.addEventListener('resize', this.resize.bind(this))
        }
        
    }

    resize()
    {
        this.modalContainer.style.width = this.html.clientWidth + "px"
    }
}