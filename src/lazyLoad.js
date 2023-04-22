import {APIkey, monthArr } from "./main.js";
import { showPremiers } from "../modules/showFilms.js";
const windowHeight = document.documentElement.clientHeight;
const filmsBlock = document.querySelector('.films_list');
const preLoader = document.querySelector('.pre_loader');
let month = new Date().getMonth() === 11 ? 0 : new Date().getMonth() + 1;
let year = new Date().getFullYear();

window.addEventListener("scroll", lazyScroll);

function lazyScroll() {
    if(!filmsBlock.classList.contains("loading") && !filmsBlock.classList.contains("searching")) {
        loadMore();
    }
}

function loadMore() {
    const loadMoreOfset = filmsBlock.getBoundingClientRect().top + pageYOffset;
    const loadMoreHeight = filmsBlock.offsetHeight;
    console.log(loadMoreOfset);
    if(pageYOffset > (loadMoreOfset + loadMoreHeight) - windowHeight) {
        getContent()
    }
}

async function getContent() {
    const premiersUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${year}&month=${monthArr[month]}`;
    console.log(month);
    console.log(monthArr[month]);
    if(month !== 11) {
        preLoader.classList.add('_loading')
        filmsBlock.classList.add('loading')
        await showPremiers(APIkey,premiersUrl);
        month++;
        filmsBlock.classList.remove('loading')
        preLoader.classList.remove('_loading')
    } else { 
        preLoader.classList.add('_loading');
        filmsBlock.classList.add('loading');
        await showPremiers(APIkey,premiersUrl);
        month = 0;
        year++;
        filmsBlock.classList.remove('loading')
        preLoader.classList.remove('_loading')
    }
}