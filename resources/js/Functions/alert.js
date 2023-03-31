import { createElement } from "../create-modal";

/**
 * crée un alert
 * 
 * @param {string} className class propre à l'alert, et qui se charge de son affichage
 * @param {string} message 
 */
export default function createAlert(className, message)
{
    let element = createElement('div', 'notification')
    element.style.width = screen.width * 80 / 100 + 'px'
    element.style.left = screen.width * 0.1 + 'px'
    document.body.appendChild(element)
    element.innerHTML = message
    element.offsetWidth
    element.classList.add(className)
    
    return element
}