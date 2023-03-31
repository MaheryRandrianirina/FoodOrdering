import { get, post } from "../ajax"
import { createElement } from "../create-modal"

export function Search(){
    let q = document.querySelector('.search-input')
    if(q !== null){
        let btn = q.nextElementSibling

        q.addEventListener('click', getAll)
        q.addEventListener('keyup', showSearchSuggestions)
        document.body.addEventListener('click', (e)=>{
            let suggestionsContainer = document.querySelector('.search-suggestions')
            if(suggestionsContainer !== null){
                suggestionsContainer.classList.remove('active-suggestion')
                document.body.removeChild(suggestionsContainer)
                q.parentElement.querySelector('.loupe').classList.remove('add-one-px-pad')
            }
        }, true)
        
        if(q !== null && btn !== null){
            btn.addEventListener('click', (e)=>{
                if(q.value === ''){
                    e.preventDefault()
                    q.focus()
                    
                }
            })
        }
    }
}

/**
 * affiche les suggestions de recherche
 * 
 * @param {Event} e 
 */
function showSearchSuggestions(e){
    let q = e.target
    let keys = JSON.parse(localStorage.getItem('search-keys'))
    let suggestionsContainer = document.querySelector('.search-suggestions')
    
    if(!suggestionsContainer.classList.contains('active-suggestion')){
        suggestionsContainer.classList.add('active-suggestion')
    }

    suggestionsContainer.innerHTML = ''

    keys.forEach(key => {
        let suggestion = createElement('p', 'suggestion')
        let lastSuggestion = ''
        
        if(key.includes(q.value) && q.value !== ''){
            if(lastSuggestion !== key){
                suggestion.innerHTML = key
                lastSuggestion = suggestion.innerHTML
            }
            
            suggestionsContainer.appendChild(suggestion)

            suggestion.addEventListener('click', (e)=>{
                q.value = suggestion.innerHTML
            })
        }
        
    })
}

/**
 * 
 * @param {Event} e 
 */
export function getAll(e){
    let q = e.target

    if(q.getAttribute('name') === 'q'){
        const isFirstSearch = localStorage.getItem('is-first-search')
        q.parentElement.querySelector('.loupe').classList.add('add-one-px-pad')

        if(document.querySelector('.search-suggestions') === null){
            let suggestionsContainer = createElement('div', 'search-suggestions')
            document.body.appendChild(suggestionsContainer)
            suggestionsContainer.style.left = q.getBoundingClientRect().left + 'px'
            suggestionsContainer.style.width = q.clientWidth + 'px'

            if(isFirstSearch === null){
                get('/get-all')
                    .then(res => {
                        localStorage.setItem('search-keys', res)
                        localStorage.setItem('is-first-search', true)
                    })
                    .catch(err => console.error(err))
            }
        }
    // CETTE PARTIE EST EN RACORD AVEC LE CLICK SUR LE BOUTON D'AJOUT D'UN NOUVEAU PLAT    
    }else{
        localStorage.removeItem('is-first-search')
    }
}