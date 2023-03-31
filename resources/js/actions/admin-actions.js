import AdminActionsOnRecipes from "../AbstractClasses/AdminActionsOnRecipes"
import DOMInteractions from "../AbstractClasses/DOMInteractions"
import NewAdminCreationDOMInteractions from "../AbstractClasses/NewAdminCreationDOMInteractions"
import { get } from "../ajax"

export default class AdminAction {
    
    constructor()
    {
        this.adminCreationDOM = new NewAdminCreationDOMInteractions()
        this.dom = new DOMInteractions()
        new AdminActionsOnRecipes()

        this.createActionButton()
        this.dom.hideMenuWhenBodyClick()
        this.clickOnDeleteAdminButtons()
        this.removeAlertsOfCreation()
    }

    createActionButton()
    {
        let buttonActions = this.adminCreationDOM.createElement('div', 'button actions')

        this.dom.innerElementContentHTML(buttonActions, 'Actions')
        document.querySelector('.admin-actions-bar')?.appendChild(buttonActions)

        buttonActions.addEventListener('click', this.handleButtonClick.bind(this))
    }

    getHTMLlinksForActions()
    {
        let infosForActionsMenu = document.querySelector('.infos_for_actions_menu')
        return infosForActionsMenu !== null ? infosForActionsMenu.innerHTML : ''
    }

    handleButtonClick(e)
    {
        e.stopPropagation()
        const htmlLinksForActions = this.getHTMLlinksForActions()
        const content = `
        <a href="/admin/post/new">Ajouter un plat</a>
        <a href="/admin/commands">Commandes </i></a>
        ${htmlLinksForActions}
        `
        
        this.dom.toggleMenu(e, {
            className: "menu-actions",
            content: content
        })

        this.clickOnActionsMenuComponents()
    }

    clickOnActionsMenuComponents()
    {
        this.createAdminComponent()
    }

    clickOnDeleteAdminButtons()
    {
        let deleteAdminBtns = document.querySelectorAll('.admin-table .feather-trash-2')
        deleteAdminBtns.forEach(button => {
            button.addEventListener('click', this.handleDeleteAdmin.bind(this, button))
        })
    }

    createAdminComponent()
    {
        this.dom.menu.querySelector('.create_admin')?.addEventListener('click', e => {
            get('/admin/create').then(res => {
                this.adminCreationDOM.createModal('create_admin_modal', res)
                this.adminCreationDOM.handleActionsInModalContent()
            }).catch(error => {
                console.error(error)
            })
        })
    }

    handleDeleteAdmin(button)
    {
        const tr = button.parentElement.parentElement
        const admiName = tr.firstElementChild.innerHTML
        const content = `
        <p>Vous êtes sûr de vouloir supprimer l'administateur ${admiName} ?</p>
        <p class='button cancel'>Annuler</p><a class='button sure-delete'>Supprimer</a>
        `
        this.adminCreationDOM.currentClickedButton = button
        this.adminCreationDOM.createModal('sure', content)
        this.adminCreationDOM.handleActionsInModalContent()
    }

    removeAlertsOfCreation()
    {
        let success = document.querySelector('.admin_creation_success')
        let errors = document.querySelector('.admin_creation_fail')

        setTimeout(()=>{
            if(success){
                success.classList.add('zero_opacity')
                success.parentElement.removeChild(success)
            }
            if(errors){
                errors.classList.add('zero_opacity')
                errors.parentElement.removeChild(errors)
            }
        }, 3000)
    }

}