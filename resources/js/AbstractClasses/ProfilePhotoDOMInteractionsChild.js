
import { post, get } from "../ajax"
import DOMInteractions from "./DOMInteractions"

export default class ProfilePhotoDOMInteractions extends DOMInteractions {

    notificationClassName = 'added-profile-photo'

    constructor()
    {
        super()
    }

    /**
     * @function toggleMenu
     * @param {{className: string, content: {IfNoProfilePhotoYet: string, IfThereIsProfilePhoto: string}}} data 
     */
    showMenu(data, btnClickedForMenu)
    {
        super.showMenu(data, btnClickedForMenu)
        let profilePhoto = document.querySelector('.profile-photo')
        
        if(!Array.from(profilePhoto.classList).includes('empty')){
            this.menu.innerHTML = data.content.IfNoProfilePhotoYet
        }else{
            this.menu.innerHTML = data.content.IfThereIsProfilePhoto
        }

        this.handleActionsInMenuContent()
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {{IfNoProfilePhotoYet: string, IfThereIsProfilePhoto: string} | string} contentHTML 
     */
    innerElementContentHTML(element, contentHTML)
    {
        if(typeof contentHTML === 'object'){
            element.innerHTML = contentHTML.IfNoProfilePhotoYet ? contentHTML.IfNoProfilePhotoYet : contentHTML.content.IfThereIsProfilePhoto
        }else{
            element.innerHTML = contentHTML
        } 
    }

    handleActionsInMenuContent()
    {
        
        let showProfilePhoto = this.menu.querySelector('.show-profile-photo')
        let editProfilePhoto = this.menu.querySelector('.edit-profile-photo')
        
        if(showProfilePhoto !== null){
            showProfilePhoto.addEventListener('click', this.handleShowProfilePhoto.bind(this))
        }
        if(editProfilePhoto !== null){
            editProfilePhoto.addEventListener('click', this.handleEditProfilePhoto.bind(this))
        }
    }

    /**
     * 
     * @param {Event} e 
     */
    handleShowProfilePhoto(e)
    {
        e.stopPropagation()
        this.hideMenu()

    }

    /**
     * 
     * @param {Event} e 
     */
    handleEditProfilePhoto(e)
    {
        e.stopPropagation()
        e.preventDefault()

        this.hideMenu()
        this.showEditProfilePhotoModal()
    }

    showEditProfilePhotoModal()
    {
        this.userId = parseInt(document.querySelector('.user-id').value)
        this.formAction = `/profile-photo/edit/${this.userId}`
        
        get(this.formAction).then(res => {
            this.createModal('photo-edit-modal', res)
            this.handleActionsInModalContent()
        }).catch(err => {
            console.error(err)
        })
    }
}