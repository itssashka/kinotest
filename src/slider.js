import showModal from "./modal.js";
import { returnData } from "../modules/showFilms.js";
const date = new Date();
const monthArr = [
    "JANUARY", 
    "FEBRUARY", 
    "MARCH", 
    "APRIL", 
    "MAY", 
    "JUNE", 
    "JULY", 
    "AUGUST",
    "SEPTEMBER",
    "NOVEMBER",
    "DECEMBER"
];

const swiperWrapper = document.querySelector('.swiper-wrapper');

export default async function addSwiper(APIkey) {
  await getFilms(APIkey, `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${date.getFullYear()}&month=${monthArr[date.getMonth()]}&page=1`);
  createSwiper();
}

async function getFilms(apiKey,url) {  
  const data = await returnData('releases',apiKey, url);
  data.releases.forEach((film) => {
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-item', 'swiper-slide')
    swiperSlide.setAttribute('data-filmid', film.filmId)
    swiperSlide.innerHTML = `
      <div class="swiper-img">
      <img src="${film.posterUrl}" alt="${film.nameRu}">
      </div>
      <div class="swiper-film_name">${film.nameRu.length > 0 ? film.nameRu : film.nameEn}</div>
    `
    movieOnClick(swiperSlide, apiKey);

    swiperWrapper.appendChild(swiperSlide);
  });
}

function createSwiper() {
  new Swiper('.swiper', {
    // Optional parameters
    spaceBetween: 5,
    slidesPerView: `auto`,
    centeredSlides: true,
    roundLengths: true,
    loop: true,
    loopAdditionalSlides: 30,
  
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
}

function movieOnClick(filmCard, apiKey) {
  filmCard.addEventListener('click', e => {
      if(!e.currentTarget.classList.contains('swiper-slide-next') && !e.currentTarget.classList.contains('swiper-slide-prev')) {
        const filmId = filmCard.dataset.filmid;
      showModal(`movie`, apiKey, filmId);
      }      
  })
}
