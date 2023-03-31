import { isArrayLike } from "lodash";
import { AddToWish } from "./actions/simple-user-buttons-action";

export class Carousel {

    /**
     * @callback moveCallback
     * @param {number} index
     */


    /**
     *
     * @param {HTMLElement} element
     * @param {*} options
     * @param {boolean} [options.loop = false] doit-on boucler en fin de chaine ?
     */
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({},
            {
                visible: 2,
                offset: 1,
                loop: false
            },
            options
        );

        let children = [].slice.call(element.children)
        // ce sera sur ça qu'on fera se deplacer le carousel
        this.root = this.createElement('div', 'carousel')
        this.root.setAttribute('tabindex', '0')
        // ce sera ça qui se deplacera
        this.container = this.createElement('div', 'carousel__container')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.moveCallbacks = []
        this.currentItem = 0
        this.isMobile = false
        this.isDesktop = false

        this.items = children.map(child => {
            let item = this.createElement('div', 'carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })

        this.setStyle()
        
        this.handleResize()
        this.createNavigation()
        
        // EVENEMENTS
        this.moveCallbacks.forEach(cb => cb(0))
        window.addEventListener('resize', this.handleResize.bind(this))
        this.root.addEventListener('keyup', (e)=>{
            if(e.key === "ArrowRight"){
                this.next()
            }else if(e.key === 'ArrowLeft'){
                this.prev()
            }
        })

        this.CarouselTouchEvent = new CarouselTouchEvent(this)
    }

    /**
     * applique les styles
     */
    setStyle()
    {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = ratio * 100 + "%"
        
        this.items.forEach(item => {
            item.style.width = 100 / this.slidesVisible / ratio + "%"
        })
    }

    createNavigation()
    {
        let nextButton = this.createElement('div', 'fas fa-arrow-right carousel__next')
        let prevButton = this.createElement('div', 'fas fa-arrow-left carousel__prev')
        
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)

        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))

        if(this.options.loop){
            return
        }
        
        this.onMove(index => {
            if(index === 0){
                prevButton.classList.add('carousel--prev__hidden')
            }else{
                prevButton.classList.remove('carousel--prev__hidden')
            }

            if(
                this.items[index + this.slidesVisible] === undefined
            ){
                nextButton.classList.add('carousel--next__hidden')
            }else{
                nextButton.classList.remove('carousel--next__hidden')
            }
        })
    }

    next()
    {
        this.gotoItem(this.currentItem + this.slidesVisible)
    }

    prev()
    {
        this.gotoItem(this.currentItem - this.slidesVisible)
    }

    /**
     * @param {number} index la direction où aller
     */
    gotoItem(index)
    {
        if(index < 0) {
            // IL FAUT EGALEMENT VERIFIER QUE LE BOUTON CLIQUE EST CACHE OU VISIBLE
            if(this.options.loop){
                index = this.items.length - this.slidesVisible
            }else{
                return
            }
            
        }else if(index >= this.items.length || (this.items[index] === undefined && index > this.currentItem)){
            if(this.options.loop){
                index = 0
            }else{
                return
            }
            
        }
        let translateX = index * -100 / this.items.length + "%"

        this.translate(translateX)
        this.currentItem = index
        this.CarouselTouchEvent.carouselCurrentItem = index
        this.moveCallbacks.forEach(cb => cb(index))
    }

    /**
     * rajoute un callback dans moveCallbacks
     * 
     * @param {moveCallback} cb affiche ou cache un bouton 
     */
    onMove(cb){
        this.moveCallbacks.push(cb)
    }

    disableTransition()
    {
        this.container.style.transition = 'none'
    }

    enableTransition()
    {
        this.container.style.transition = ''
    }

    translate(translateX){
        this.container.style.transform = `translate3d(${translateX}, 0, 0)`
    }

    /**
     * @return {HTMLElement} element
     */
    createElement(type, className = null) {
        let element = document.createElement(type);
        if (className !== null) {
            element.className = className;
        }
        return element;
    }

    /**
     * stoppe la propagation d'évènement dans les boutons
     * @param {Event} e
     */
    stopPropagation(e) {
        if (this.i >= 1) {
            e.stopPropagation();
        }
        this.i++;
    }

    /**
     * changement au niveau du carousel lors d'une resize
     */
    handleResize(){
        let htmlBalise = document.querySelector('html')
        let mobile = htmlBalise.clientWidth <= 500
        let desktop = htmlBalise.clientWidth > 500 && htmlBalise.clientWidth <= 900
        
        if(mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
        }else if(desktop !== this.isDesktop) {
            this.isDesktop = desktop
            this.setStyle()
        }
    }

    get slidesVisible()
    {
        if(this.isMobile) {
            return 1
        }else if(this.isDesktop) {
            return this.options.visible
        }else {
            return 3
        }
    }

    get slidesToScroll()
    {
        if(this.isMobile){
            return 1
        }else if(this.isDesktop) {
            return this.options.offset
        }else {
            return 3
        }
    }

    get containerWidth ()
    {
        return this.container.offsetWidth
    }
}

/**
 * @param {HTMLElement} carousel
 */
class CarouselTouchEvent {
    constructor(carousel) {
        
        if(carousel.items.length > 1){
            // ANNULER L'EFFET DE DRAG SUR UNE IMAGE PAR LA SOURIS
            window.addEventListener('dragstart', (e) => { e.preventDefault() })
            carousel.container.addEventListener("mousedown", this.startDrag.bind(this))
            carousel.container.addEventListener("touchstart", this.startDrag.bind(this))

            this.stopPropagationOfTouchstartEventOn([
                carousel.container.querySelectorAll('.heart-icon'),
                carousel.container.querySelectorAll('.add')
            ])

            window.addEventListener('mousemove', this.drag.bind(this))
            window.addEventListener('touchmove', this.drag.bind(this))
            window.addEventListener('touchcancel', this.endDrad.bind(this))
            window.addEventListener('touchend', this.endDrad.bind(this))
            window.addEventListener('mouseup', this.endDrad.bind(this))

        }

        this.carousel = carousel
        this.carouselContainerWidth = this.carousel.containerWidth
        this.carouselCurrentItem = this.carousel.currentItem
    }

    /**
     * 
     * @param {Event} e 
     * @returns 
     */
    startDrag(e) {
        e.preventDefault()

        if(e.touches){
            if(e.touches.length > 1){
                return
            }else{
                e = e.touches[0]
            }
        }

        this.origin = {x: e.screenX, y: e.screenY}
        this.carousel.disableTransition()
        
    }

    /**
     * 
     * @param {Event} e 
     */
    drag(e) {
        if(this.origin){
            let touch = e.touches ? e.touches[0] : e
            this.translate = {x: touch.screenX - this.origin.x, y: touch.screenY - this.origin.y}
            let baseTranslate = this.carouselCurrentItem * -100 / this.carousel.items.length
            
            this.carousel.translate(baseTranslate + this.translate.x * 100 / this.carouselContainerWidth + "%")

            if(this.carouselCurrentItem < 0){
                this.carouselCurrentItem = 0
            }else if(this.carouselCurrentItem > this.carousel.items.length / this.carousel.slidesVisible){
                this.carouselCurrentItem = this.carousel.items.length / this.carousel.slidesVisible
            }
        } 
    }

    /**
     * Fin du drag
     */
    endDrad(e){
        if(this.origin) {
            this.carousel.enableTransition()
            this.origin = null
            if(this.translate !== undefined && this.translate.x < 0){
                this.carouselCurrentItem = this.carouselCurrentItem + Math.abs(this.translate.x / this.carousel.items[0].offsetWidth)
            }else if(this.translate !== undefined && this.translate.x > 0){
                this.carouselCurrentItem = this.carouselCurrentItem - Math.abs(this.translate.x / this.carousel.items[0].offsetWidth)
            } 
            
            if(this.carouselCurrentItem < 0){
                this.carouselCurrentItem = 0
            }
            
        }
    }

    /**
     * stoppe la propagation du toucstart sur les elements en params
     * 
     * @param {HTMLElement[]} allElements contient des HTMLCollections
     */
    stopPropagationOfTouchstartEventOn(allElements) {
        allElements.forEach(elements => {
            if(isArrayLike(elements)){
                elements.forEach(el => {
                    el.addEventListener('touchstart', (e)=>{
                        e.stopPropagation()
                    })
                })
            }else{
                if(elements !== null){
                    elements.addEventListener('touchstart', (e)=>{
                        e.stopPropagation()
                    })
                }
                
            }
            
        })
    }
}
