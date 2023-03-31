import { HideHamburgerMenu, ShowHamburgerMenu } from "../bars-menu"
import { closeModal, createElement, createModal } from "../create-modal"
import DOMInteractions from "../AbstractClasses/DOMInteractions"

let dom = new DOMInteractions()

export default function Logout(){
    let logout = document.querySelector('.logout')
    if(logout){
        logout.addEventListener('click', HandleLogout)
    }
    
}

/**
 * click sur logout dans le menu hamburger
 * @param {Event} e 
 */
export const HandleLogout = (e)=>{
    e.stopPropagation()

    dom.createModal('sure', `
    <p class='sure-question'>Etes-vous sur de vouloir vous déconnecter ? </p>
    <a class='button yes' href='/user/logout'>Se déconnecter</a><p class='button no'>Non</p>`
    )
    
    dom.handleActionsInModalContent()

    handleIssueLogoutInAMenu(e)
}

const handleIssueLogoutInAMenu = (e) => {

    let bars = document.querySelector('.hamburger-menu')
    if(bars !== null){
        HideHamburgerMenu(e)
        bars.removeEventListener('click',ShowHamburgerMenu)
    } 
}

