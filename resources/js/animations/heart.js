export default class Heart {
    constructor(img)
    {
        this.img = img
    }

    add()
    {
        this.createHeart('add-heart')
    }

    createHeart(className)
    {
        let heart = this.img.parentElement.querySelector('.fa-heart')
        if(heart !== null){
            this.img.parentElement.removeChild(heart)
        }
        let i = document.createElement('i')
        i.className = 'fas fa-heart'
        this.img.after(i)
        this.style(i)
        i.offsetWidth
        i.classList.add(className)
        
        setTimeout(()=>{
            i.classList.remove('add-heart')
            i.addEventListener('transitionend', ()=>{
                this.img.parentElement.removeChild(i)
            })
        }, 2000)
    }

    style(i)
    {
        i.style.fontSize = '30px'
        i.style.position = 'absolute'
        i.style.top = '45%'
        i.style.left = '45%'
        i.style.color = '#fff'
        i.style.transition = 'transform 0.3s'
    }
}