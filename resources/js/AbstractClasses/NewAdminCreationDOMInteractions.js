import { isEmpty } from "lodash";
import AdminActionsDOMInteractions from "./AdminActionsDOMInteractions";
import DOMInteractions from "./DOMInteractions";

export default class NewAdminCreationDOMInteractions extends AdminActionsDOMInteractions {

    notificationClassName = 'created-admin'
    formAction = '/admin/create'

    constructor()
    {
        super()
        this.reloadPageAfterAction = true
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

    createNewElementsForPostRequest()
    {
        const adminId = parseInt(document.querySelector('.admin_id').value)
        this.formAction = `/admin/delete/${adminId}`
        this.notificationClassName = 'deleted_admin'
        this.createDataToPostObj()
    }

    retireDeletedElementFromList()
    {
        let td = this.currentClickedButton.parentElement
        let tr = td.parentElement
        let tbody = tr.parentElement
        
        tr.classList.add('zero_opacity')
        tr.addEventListener('transitionend', ()=>{
            tbody.removeChild(tr)
            
            if(tbody.querySelectorAll('tr').length === 0){
                this.reloadPage()
            }
        })
    }
}