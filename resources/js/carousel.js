$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        margin: 10,
        responsive:{
            0:{
            items:1
            },
            600:{
            items:3
            },
            1000:{
            items:5
            }
        },
        lazyLoad: true   
    });
});