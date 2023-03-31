import AdminRecipeDOMInteractions from "./AdminRecipeDOMInteractions"

export default class AdminActionsOnRecipes {
    constructor()
    {
        this.clickOnDeleteRecipe()
    }

    clickOnDeleteRecipe()
    {
        let deleteRecipeButtons = document.querySelectorAll('.recipe_delete_button')
        deleteRecipeButtons.forEach(deleteRecipeButton => {
            deleteRecipeButton.addEventListener('click', this.handleDeleteRecipe.bind(this))
        })
    }

    handleDeleteRecipe(e)
    {
        e.preventDefault()

        let domInteractions = new AdminRecipeDOMInteractions()
        domInteractions.currentClickedButton = e.currentTarget
        domInteractions.createModal("delete_recipe_modal", `
        <p>Êtes-vous réellement sûr de vouloir supprimer ce plat?"</p>
        <button class='button sure-delete'>Oui, supprimer ce plat</button>
        <button class='button cancel'>Annuler</button>
        `)
        domInteractions.handleActionsInModalConfirmation()
    }

    createNewElementsForPostRequest()
    {
        const adminId = parseInt(document.querySelector('.admin_id').value)
        this.formAction = `/admin/delete/${adminId}`
        this.createDataToPostObj()
        
    }
}