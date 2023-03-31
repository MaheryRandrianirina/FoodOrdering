import { isEmpty } from "lodash"
import { post } from "../ajax"

export default class DOMInteractions {

    formAction = ''
    notificationClassName = ''
    showNotification = true

    constructor()
    {
        this.emptyInputsMessage = []
        this.timeOutForReload = 1000
        this.modalHeightToAdd = 0
        this.responseJSON
    }


    animateElementFromClassname(element, classNameForAnimation)
    {
        element.offsetWidth
        element.classList.add(classNameForAnimation)
    }

    appendModalToDOM()
    {
        document.body.appendChild(this.modalContainer)
        this.modalContainer.appendChild(this.modal)
    }

    createCircleLoader()
    {
        this.createCircle()
    }

    createCircle()
    {
        this.circle = this.createElement('div', 'circle_loader')
        document.body.appendChild(this.circle)
    }

    removeModalFromDOMWithAnimation()
    {
        this.modal.classList.remove('active-modal')
        this.modal.addEventListener('transitionend', ()=>{
            if(
                this.modalContainer
                && this.modalContainer.parentElement !== null
            ){
                this.modalContainer.parentElement.removeChild(this.modalContainer)
            }  
        })
    }
    
    /**
     * @return {HTMLElement} element
     */
    createElement(type, className = null) 
    {
        let element = document.createElement(type);
        if (className !== null) {
            element.className = className;
        }
        return element;
    }

    createModal(className, content)
    {
        this.modalContainer = this.createElement('div', 'modal-container')
        this.modal = this.createElement('div', `main-modal ${className}`)

        this.giveStyleToModalContainer()
        this.appendModalToDOM()
        this.animateElementFromClassname(this.modal, 'active-modal')
        this.innerElementContentHTML(this.modal,  content)
        this.modalContainer.addEventListener('click', this.closeModalThenRemoveHisEventListener.bind(this))
        this.avoidCloseModalOnClickIn()

        return this.modal
    }

    avoidCloseModalOnClickIn()
    {
        this.modal.addEventListener('click', (e)=>{
            e.stopPropagation()
        })
    }

    closeModal()
    {
        this.removeModalFromDOMWithAnimation()
        let notRemovedModal = document.querySelector('.modal-container')
        if(notRemovedModal){
            this.removeElementFromDOM(notRemovedModal)
        }
    }

    handleActionsInModalContent()
    {
        if(this.isModalAForm()){
            this.handleActionsInModalForm()
        }else if(this.isModalConfirmation()){
            this.handleActionsInModalConfirmation()
        }else {
            this.handleActionsInSimpleModal()
        }
    }

    isModalAForm()
    {
        const modalForm = this.modal.querySelector('form')
        return modalForm !== null
    }

    isModalConfirmation()
    {
        return this.modal.classList.contains('sure')
    }

    handleActionsInModalForm()
    {
        console.log('modal form')
        this.modalAddBtn = this.modal.querySelector('.modal-add')
        this.modalAddBtn.addEventListener('click', this.handleModalAddButtonClick.bind(this))
        this.ClickOnCloseModalButton()
    }

    handleActionsInModalConfirmation()
    {
        let noBtn = this.modal.querySelector('.no')

        noBtn?.addEventListener('click', ()=>{
            this.removeModalFromDOMWithAnimation()
        })
    }

    ClickOnCloseModalButton()
    {
        this.modalCloseBtn = this.modal.querySelector('.close-btn')
        this.modalCloseBtn.addEventListener('click', this.closeModalThenRemoveHisEventListener.bind(this))
    }

    handleActionsInSimpleModal()
    {
        this.ClickOnCloseModalButton()
    }
    
    /**
     * 
     * @param {MouseEvent} e 
     */
    handleModalAddButtonClick(e)
    {
        e.preventDefault()

        this.createDataToPostObj()
        if(this.isDataPostValid()){
            this.postForm()
        }else{
            this.alertEmptyInputs()
        }
    }

    /**
     * 
     * @param {Event} e 
     */
    closeModalThenRemoveHisEventListener(e)
    {
        this.closeModal()
        e.target.removeEventListener('click', this.closeModalThenRemoveHisEventListener)
    }
    
    /**
     * @var currentClickedButton est déclarée dans une méthode là où l'on a besoin qu'elle
     * ne soit plus undefined prochainement
     */
    createDataToPostObj()
    {
        this.modalInputs = [].slice.call(this.modal.querySelectorAll('input'))

        if(this.currentClickedButton){
            this.hiddenInputsContainingDataNeededForDeletion = [].slice.call(this.currentClickedButton.parentElement.querySelectorAll('input[type="hidden"]'))
        }
        
        this.dataToPostObj = {}
        
        if(!isEmpty(this.modalInputs)){
            this.modalInputs.forEach(input => {
                this.setIntoDataToPostValueOf(input) 
            })
        }else if(!isEmpty(this.hiddenInputsContainingDataNeededForDeletion)) {
            this.hiddenInputsContainingDataNeededForDeletion.forEach(input => {
                this.setIntoDataToPostValueOf(input)
            })
        }
        
    }

    setIntoDataToPostValueOf(input)
    {
        if(
            input.type === 'text' || 
            input.type === 'number' || 
            input.type === 'email' ||
            input.type === 'hidden' || 
            input.type === 'password'
        ){
            this.dataToPostObj[input.name] = input.value
        }else if(input.type === 'file'){
            this.dataToPostObj[input.name] = input.files[0]
        }
    }

    /**
     * @return {boolean} retourne s'il y a un input vide
     */
    isDataPostValid()
    {
        let isInputEmpty = true
        
        for(const name in this.dataToPostObj){
            if(this.dataToPostObj[name] === null ||
                this.dataToPostObj[name] === '' || 
                this.dataToPostObj[name] === undefined
            ){
                this.emptyInputsMessage[name] = "Ce champ ne peut pas être vide."
                isInputEmpty = false
            }
        }

        return isInputEmpty
    }

    postForm()
    {
        if(this.showNotification){
            this.postContentWithNotificationThenReload()
        }else{
            this.submitDirectyly()
        }
        
    }
    
    alertEmptyInputs()
    {
        this.modalInputs.forEach(input => {
            if(this.isMessageCorrespondsTo(input.name)){
                this.showErrorMessage(input)
            }
        })
    }
    

    /**
     * 
     * @param {string} inputName 
     * @returns {boolean} Est-ce qu'il y a un message d'erreur correspondant au nom de l'input ?
     */
    isMessageCorrespondsTo(inputName)
    {
        return this.emptyInputsMessage[inputName] !== null || this.emptyInputsMessage[inputName] !== undefined
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     */
    showErrorMessage(input)
    {
        if(input.name === 'image'){
            this.alertEmptyImage(input)
        }else{
            this.showMessageAfter(input)
        }
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     */
    alertEmptyImage(input)
    {
        input.focus()
        this.showMessageAfter(input)
    }

    createFailParapgraph(inputName)
    {
        let failParagraph = this.createElement('small', 'form-text text-muted fail')
        failParagraph.innerHTML = this.emptyInputsMessage[inputName]

        return failParagraph
    }
    
    showAlertMsgBeforeBtn(inputName)
    {
        this.form.removeChild(this.modalAddBtn)
        let failParagraph = this.createFailParapgraph(inputName)

        this.form.appendChild(failParagraph)
        this.form.appendChild(this.modalAddBtn)
    }

    showMessageAfter(input)
    {
        const failParagraph = this.createFailParapgraph(input.name)
        const elementAfterInput = input.nextElementSibling

        if(elementAfterInput === null){
            input.after(failParagraph)
            this.modalHeightToAdd = failParagraph.offsetHeight
            this.growModalHeigth()
        }
    }

    growModalHeigth()
    {
        this.modal.style.height = this.modal.offsetHeight + this.modalHeightToAdd + 'px'
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
                    
                    this.reloadPage()
                }
            })
            .catch(error => console.error(error))
    }

    submitDirectyly()
    {
        this.modal.querySelector('form').submit()
    }

    reloadPage()
    {
        setTimeout(()=>{
            location.reload()
        }, this.timeOutForReload)
        
    }

    /**
     * 
     * @param {{className: string, content: string}} data 
     * @param {number} timeInMilliseconds 
     */
    showNotificationWithDataInMilliseconds(data, timeInMilliseconds)
    {
        this.createModal(data.className, data.content)

        setTimeout(()=>{
            this.closeModal()
        }, timeInMilliseconds)
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} contentHTML 
     */
    innerElementContentHTML(element, contentHTML)
    {
        if(typeof contentHTML === "object") {
            element.appendChild(contentHTML)
        }else {
            element.innerHTML = contentHTML
        }
        
    }

    giveStyleToModalContainer()
    {
        this.modalContainer.style.width = window.innerWidth + 'px'
    }

    stopEventPropagationInBody()
    {
        document.body.addEventListener('click', e => {
            e.stopPropagation()
        })
    }

    /**
     * 
     * @param {Event} e 
     * @param {{className: string, content: string | {}, appendTo: HTMLElement | null}} data 
     */
    toggleMenu(e, data)
    {   
        this.menu = document.querySelector(".menu." + data.className)
        if(this.menu === null){
            this.showMenu(data, e.currentTarget)
        }else{
            this.hideMenu()
        }
    }

    /**
     * 
     * @param {{className: string, content: string}} data 
     */
    showMenu(data, btnClickedForMenu)
    {
        this.btnClickedForMenu = btnClickedForMenu
        this.menu = this.createElement('div', `menu ${data.className}`)
        document.body.appendChild(this.menu) 

        this.setMenuPositionByBtnClickedAndMenuWidth()
        this.innerElementContentHTML(this.menu, data.content)
        this.animateElementFromClassname(this.menu, 'active-menu')
    }
    

    hideMenu()
    {
        if(this.menu){
            this.menu.classList.remove('active-menu')
            this.menu.addEventListener('transitionend', ()=>{
                if(this.menu.parentElement){
                    this.menu.parentElement.removeChild(this.menu)
                }
            })
        }
    }

    hideMenuWhenBodyClick()
    {
        document.body.addEventListener('click', (e)=>{
            this.hideMenu()
        })
    }

    setMenuPositionByBtnClickedAndMenuWidth()
    {
        let buttonRect = this.btnClickedForMenu.getBoundingClientRect()
        this.menu.style.left = buttonRect.x - this.menu.offsetWidth / 2 + "px"
        this.menu.style.top = buttonRect.top + this.btnClickedForMenu.offsetHeight + 'px'
        
    }

    createTooltipMenu(e, data)
    {
        this.toggleMenu(e, data)
    }

    removeElementFromDOM(element)
    {
        element?.parentElement.removeChild(element)
    }

    createErrorAlertAfterElement(elementId, errorMessage)
    {
        let smallElement = this.createElement('small', 'text-muted') 
        smallElement.innerHTML = errorMessage
        this.modal.querySelector(elementId).after(smallElement)
        this.modalHeightToAdd = smallElement.offsetHeight
        this.growModalHeigth()
    }

    static removeCircleLoader()
    {
        const circleLoader = document.querySelector('.circle_loader')
        if(circleLoader !== null){
            document.body.removeChild(circleLoader)
        }   
    }
}