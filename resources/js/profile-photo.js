
import ProfilePhotoDOMInteractions from "./AbstractClasses/ProfilePhotoDOMInteractionsChild"


export default function ProfilePhoto()
{
    let PPDOMInteractions = new ProfilePhotoDOMInteractions()
    
    let profilePhoto = document.querySelector('.profile-photo')
    profilePhoto?.addEventListener('click', e => {
        e.stopPropagation()
        
        PPDOMInteractions.toggleMenu(e, {
            className: "profile-photo-menu",
            content: {
                IfNoProfilePhotoYet: `<a href='/profile-photo/show' class='show-profile-photo'><i class='fas fa-eye'></i> Regarder</a><p class='edit-profile-photo'><i class='fas fa-edit'></i> Modifier</p>`,
                IfThereIsProfilePhoto: `<p class='edit-profile-photo'><i class='fas fa-edit'></i> Modifier</p>`
            }
        })
    }) 

    PPDOMInteractions.hideMenuWhenBodyClick()
}
