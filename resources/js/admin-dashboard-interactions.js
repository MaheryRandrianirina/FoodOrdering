import { getAll } from "./actions/search"

export default function AdminDashboardInteractions(){
    let addButton = document.querySelector('.add-button')
    let deleteButton = document.querySelector('.button .delete')

    if(addButton !== null){
        addButton.addEventListener('click', getAll)
    }
    if(deleteButton !== null){
        deleteButton.addEventListener('click', removeKeyAutocompletion)
    }
    
}

const removeKeyAutocompletion = ()=>{

}