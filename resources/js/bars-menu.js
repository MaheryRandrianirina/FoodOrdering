import { createElement } from "./create-modal"
import { get } from "./ajax"
import { HandleLogout } from "./actions/logout"

let bars 
let i = 0

export default function BarsMenu()
{
    bars = document.querySelector('.bars .icon')
    if(bars !== null && document.querySelector('.sure') === null){
        bars.addEventListener('click', ShowHamburgerMenu)
    }
}

export const ShowHamburgerMenu = (e) => {
    e.stopPropagation()
    let bars = e.target
    let i = 0
    bars.classList.add('active-bars')

    bars.addEventListener('transitionend', (e)=>{
        if(bars.classList.contains('active-bars')){
            if(bars.parentElement !== null){
                bars.parentElement.removeChild(bars)

                let hamburgerMenu = createElement('div', 'hamburger-menu')
                document.body.appendChild(hamburgerMenu)
                hamburgerMenu.clientWidth
                hamburgerMenu.classList.add('active-hamburger')
                
                hamburgerMenu.addEventListener('transitionend', (e)=>{
                    i++
                    if(hamburgerMenu.querySelector('.icon') === null && i === 1){
                        let x = createElement('i', 'icon')
                        let logout = createElement('div', 'logout')
                        x.innerHTML = '&times'
                        hamburgerMenu.appendChild(x)
                        if(document.querySelector('input[name="recipe_id"]') !== null){
                            let basket = createElement('a', 'basket')
                            hamburgerMenu.appendChild(basket)
                            basket.setAttribute('href', '/user/wishes')
                            basket.innerHTML = `<i class='fas fa-shopping-basket'></i>  Panier`
                        }

                        hamburgerMenu.appendChild(logout)
                        logout.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4">
                            </path>
                            <polyline points="16 17 21 12 16 7">
                            </polyline>
                            <line x1="21" y1="12" x2="9" y2="12">
                            </line>
                        </svg>
                        <span>Déconnexion</span>`
                        x.offsetWidth
                        x.classList.add('close-btn')
                        x.addEventListener('click', HideHamburgerMenu)
                        if(hamburgerMenu !== null){
                            document.body.addEventListener('click', HideHamburgerMenu)
                            hamburgerMenu.addEventListener('click', (e)=>{
                                e.stopPropagation()
                            })
                        }
                        logout.addEventListener('click', HandleLogout)
                    } 
                })
                i = 0 
            }             
        }
    })     
}

/**
 * 
 * @param {Event} e 
 */
export const HideHamburgerMenu = (e) => {
    i++
    if(i === 1){
        let x
        if(e === undefined){
            x = document.querySelector('.hamburger-menu .icon')
        }else{
            if(!e.target.classList.contains('icon')){
                x = document.querySelector('.icon.close-btn')
            }else{
                e.stopPropagation()
                x = e.target
            }
        }

        let hamburger = x.parentElement
        let a = 0
        x.offsetWidth
        x.classList.add('reverse')
        
        x.addEventListener('transitionend', ()=>{
            a++
            if(a === 1){
                hamburger.removeChild(x)
                hamburger.offsetWidth
                hamburger.classList.remove('active-hamburger')
                setTimeout(()=>{
                    document.body.removeChild(hamburger)
                    document.querySelector('.bars').appendChild(bars)
                    bars.offsetWidth
                    bars.classList.remove('active-bars')
                }, 500)
            }
             
        })
    }

    document.body.removeEventListener('click', HideHamburgerMenu)
    i = 0 
}

