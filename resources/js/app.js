import './bootstrap';

import Alpine from 'alpinejs';
import ProfilePhoto from './profile-photo';
import { Search} from './actions/search';
import {SimpleUserButtonsAction} from './actions/simple-user-buttons-action';
import AdminDashboardInteractions from './admin-dashboard-interactions';
import { Carousel } from './carousel';
import BarsMenu from './bars-menu';
import Responsive from './responsive';
import Logout from './actions/logout';
import createAlert from './Functions/alert';
import AdminUserCommandsManagement from './admin/commands';
import AdminAction from './actions/admin-actions';
import DOMInteractions from './AbstractClasses/DOMInteractions';

window.Alpine = Alpine;

window.addEventListener('load', ()=>{
    DOMInteractions.removeCircleLoader()
})

window.addEventListener('DOMContentLoaded', function(){
    
    new Responsive()
    new AdminAction()
    ProfilePhoto()
    Search()
    SimpleUserButtonsAction()
    AdminDashboardInteractions()
    BarsMenu()
    Logout()
    new AdminUserCommandsManagement()
    
    let carousels = document.querySelectorAll('#Carousel')
    carousels.forEach(carousel => {
        new Carousel(carousel, {
            loop: false
        })
    })

    let paymentSuccess = document.querySelector('.payment-success')
    if(paymentSuccess !== null){
        let notification = createAlert('add-success', paymentSuccess.innerHTML)

        setTimeout(()=>{
            notification.classList.remove('add-success')
            notification.parentElement.removeChild(notification)
        }, 2000)
    }
    
})
