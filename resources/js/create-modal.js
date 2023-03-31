/**
 * crée un modal
 * @className par défaut = 'modal'
 * @param {string} className 
 * @param {string} data 
 * @return {HTMLElement} modal
 */
export function createModal(className, data)
{
    let modalContainer = createElement('div', 'modal-container')
    modalContainer.style.width = window.innerWidth + 'px'
    let modal = createElement('div', `main-modal ${className}`)
    let body = document.body
    body.appendChild(modalContainer)
    modalContainer.appendChild(modal)
    modal.offsetWidth
    modal.classList.add('active-modal')
    
    modal.innerHTML = data
    return modal

}

/**
 * 
 * @param {HTMLElement} modal 
 */
export function closeModal(){
    let modal = document.querySelector('.main-modal')
    let modalContainer = modal.parentElement
    modal.classList.remove('active-modal')

    modal.addEventListener('transitionend', ()=>{
        if(modalContainer.parentElement !== null){
            modalContainer.parentElement.removeChild(modalContainer)
        }
        
    })

}

/**
 * 
 * @param {*} type 
 * @param {*} className 
 * @returns {HTMLElement} element
 */
export function createElement(type, className = null){
    let element = document.createElement(type)

    if(className !== null){
        element.className = className
    }
    
    return element
}