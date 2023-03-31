import AdminActionsDOMInteractions from "./AdminActionsDOMInteractions";

export default class AdminRecipeDOMInteractions extends AdminActionsDOMInteractions {

    notificationClassName = 'deleted_recipe'
    
    constructor()
    {
        super()
    }

    createNewElementsForPostRequest()
    { 
        this.currentClickedButtonParent = this.currentClickedButton.parentElement
        const recipeId = parseInt(this.currentClickedButtonParent.querySelector('.recipe_id_value').value)
        this.formAction = `/post/delete/${recipeId}`
        this.createDataToPostObj()
    }

    retireDeletedElementFromList()
    {
        let elementToRemove = this.currentClickedButtonParent.parentElement.parentElement
        if(elementToRemove.parentElement.querySelectorAll('.item').length === 0){
            this.reloadPageAfterAction = true
        }
        this.removeElementFromDOM(elementToRemove)
    }
}