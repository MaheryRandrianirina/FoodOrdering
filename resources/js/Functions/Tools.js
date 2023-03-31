
/**
 * 
 * @param { HTMLAllCollection | HTMLCollection } element 
 * @returns array
 */
export function makeInchangeableArray(element) {
    return [].slice.call(element)
}

export function makeArray(element)
{
    return Array.from(element)
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} attribute 
 * @returns boolean
 */
export function hasAttribute(element, attribute) {
    return element.hasAttribute(attribute)
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} className 
 * @returns boolean
 */
export function elementContainsClassname(element, className) {
    return element.classList.contains(className)
}