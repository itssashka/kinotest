// import getFilmsFromApi from "../modules/getFilmsList.js"

// const swiperWrapper = document.querySelector('.swiper-wrapper');

// async function addSwiper() {

// }

// async function getFilms

const swiper = new Swiper('.swiper', {
    // Optional parameters
    spaceBetween: 5,
    slidesPerView: `auto`,
    centeredSlides: true,
    roundLengths: true,
    loop: true,
    loopAdditionalSlides: 30,
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    autoplay: {
        delay: 5000,
      },
    slideToClickedSlide: true,
    // And if we need scrollbar
});