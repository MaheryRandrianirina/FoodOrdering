import { post } from "../ajax"
import createAlert from "../Functions/alert"
import Heart from "../animations/heart"

/**
 * Lors du 1er click sur un coeur, l'evenement est appelé une fois
 * Mais, lors du second click, il est appelé 2 fois de suite et s'applique sur l'element enfant 'path'
 * La variable status permet donc de faire en sorte que le code ne soit éxecuté qu'une seule fois dans
 * chaque situation 
 * @var status
 */
let status = ''

export function SimpleUserButtonsAction()
{
    let heartIcons = document.querySelectorAll('.heart-icon svg')
    let images = document.querySelectorAll('.card-img-top')
    
    heartIcons.forEach(heartIcon => {
        heartIcon.addEventListener('click', AddToWish)
        heartIcon.querySelector('path').addEventListener('click', AddToWish)
    })

    images.forEach(image => {
        image.addEventListener('dblclick', AddToWish)
    })
}

/**
 * Ajoute un plat dans les souhaits (panier) de l'utilisateur
 * 
 * @param {Event} e 
 */
export const AddToWish = (e)=>{
    let heartIcon
    let target = e.currentTarget
    let img 
    
    if(target.classList.contains('card-img-top')){
        heartIcon = target.parentElement.parentElement.parentElement.querySelector('.heart-icon svg')
        img = target
    }else{
        heartIcon = e.target
    }
    
    let token = document.querySelector('input[name="_token"]').value
    let recipe_id = heartIcon.parentElement.querySelector('input[name="recipe_id"]') !== null ? heartIcon.parentElement.querySelector('input[name="recipe_id"]').value : heartIcon.parentElement.parentElement.querySelector('input[name="recipe_id"]').value
    let path 
    let fill

    if(heartIcon.classList.contains('feather')){
        path = heartIcon.querySelector('path')
        fill = path.getAttribute('fill')
        status = 'svg'
    }else{
        if(status === '' || status === 'svg'){
            path = heartIcon
            fill = heartIcon.getAttribute('fill')
            status = 'once'
        }else{
            status = ''
        }
        
    }
    
    if(status === 'svg' || status === 'once'){
        //IL FAUDRA PRENDRE EN COMPTE LE FAIT QUE fill pourrait être undefined ou null jsp
        if(fill === 'none' || fill === null){
            if(img !== undefined){
                let heart = new Heart(img)
                heart.add()
            }
            path.setAttribute('fill', '#fea702')
            post("/recipe/wish", {'_token': token, 'id': recipe_id})
                .then(res => {
                    handlePostQueryResponse(res)
                })
                .catch(err => console.error(err))
        }else{
            path.setAttribute('fill', 'none')
            post("/recipe/wish", {'_token': token, 'id': recipe_id})
                .then(res => {
                    handlePostQueryResponse(res) 
                })
                .catch(err => console.error(err))
        }
    }
}

/**
 * prend en charge le traitement de la reponse du serveur sur la requête POST
 * @param {Response} res 
 */
const handlePostQueryResponse = (res)=>{
    let alertSuccess = document.querySelector('.add-success')
    
    if(alertSuccess === null){
        createThenRemoveAlert(res)
    }else{
        alertSuccess.parentElement.removeChild(alertSuccess)
        createThenRemoveAlert()
    }
}

/**
 * 
 * @param {Response} res 
 */
const createThenRemoveAlert = (res)=>{
    let element = createAlert('add-success', JSON.parse(res).message)
    setTimeout(()=>{
        element.classList.remove('add-success')
        element.addEventListener('transitionend', ()=>{
            if(element !== null){
                element.parentElement.removeChild(element)
            }
        })
    }, 3000)
}