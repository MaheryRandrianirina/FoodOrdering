import { post } from "../ajax";
import DOMInteractions from "./DOMInteractions";

export default class AdminActionsDOMInteractions extends DOMInteractions {
    constructor()
    {
        super()
        this.reloadPageAfterAction = false
        this.actionName
    }

    handleActionsInModalConfirmation()
    {
        let cancelBtn = this.modal.querySelector('.cancel')
        let deleteBtn = this.modal.querySelector('.sure-delete')

        cancelBtn.addEventListener('click', ()=>{
            this.removeModalFromDOMWithAnimation()
        })

        deleteBtn.addEventListener('click', this.handleModalDeleteButton.bind(this))
    }

    handleModalDeleteButton(e)
    {
        e.preventDefault()
        this.actionName = 'deletion'
        this.createNewElementsForPostRequest()
        this.postContentWithNotificationThenReload()
    }

    postContentWithNotificationThenReload()
    {
        post(this.formAction, this.dataToPostObj)
            .then(response => {
                this.closeModal()
                if(this.showNotification) {
                    this.showNotificationWithDataInMilliseconds({
                        className: this.notificationClassName, 
                        content: JSON.parse(response).success
                    }, 2000)
                    
                    if(this.actionName !== undefined && this.actionName === 'deletion'){
                        this.retireDeletedElementFromList()
                    }

                    if(this.reloadPageAfterAction){
                        this.reloadPage()
                    }
                }
            })
            .catch(error => {
                this.handlePostRequestErrorCatching(error)
            })
    }

    handlePostRequestErrorCatching(error)
    {
        let errorResponse = JSON.parse(error.response)
        console.log(errorResponse)
        if('errors' in errorResponse){
            this.handleErrorsForPassword(errorResponse.errors)
            this.handleErrorsForName(errorResponse.errors)
        }
    }

    handleErrorsForPassword(errors)
    {
        if('password' in errors) {
            errors.password.forEach(passwordMessage => {
                this.caseOfPasswordConfirmationError(passwordMessage)
                this.caseOfPasswordError(passwordMessage)
            })
        }
    }

    caseOfPasswordConfirmationError(passwordMessage)
    {
        if(passwordMessage.includes('confirmation')){
            this.createErrorAlertAfterElement('#password_confirmation', passwordMessage)
        }
    }

    caseOfPasswordError(passwordMessage)
    {
        if(passwordMessage.includes('doit')){
            this.createErrorAlertAfterElement('#password', passwordMessage)
        }
    }

    handleErrorsForName(errors)
    {
        if('name' in errors){
            errors.name.forEach(nameError => {
                this.createErrorAlertAfterElement('#name', nameError)
            })
        }
    }
}