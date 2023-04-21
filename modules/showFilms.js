import getFilmsFromApi from "./getFilmsList.js"
import LocalStorageData from "./LocalStorageData.js"
import objIsEmpty from "./objIsEmpty.js";
import showModal from "../src/modal.js";

//вывод премьер
async function showPremiers(APIkey, url) {
    // const data = await returnData(`premiers`, APIkey, url);
    const data = await getFilmsFromApi(APIkey, url)
    const moviesList = document.querySelector('.films_list');
    // moviesList.innerHTML = ``;
    showFilms(data.items, APIkey, moviesList, `film_card`);
}

//вывод результатов поиска
async function showSearchResults(APIkey, url, searchRequest) {
    const data = await returnData(`${searchRequest}`, APIkey, url);
    const moviesList = document.querySelector('.films_list');
    const premiersHeader = document.querySelector('.premiers_header');
    premiersHeader.innerHTML = `Результаты поиска по запросу "${searchRequest}"`

    moviesList.innerHTML = ""
    moviesList.classList.add('searching');

    if(data.films.length > 0) {
        showFilms(data.films, APIkey, moviesList, `film_card`);
        premiersHeader.scrollIntoView(true);
    } else {        
        moviesList.innerHTML='Ничего не найдено';
        premiersHeader.scrollIntoView(true);
    }
    
}


//вывод списка фильмов
function showFilms(data, apiKey, moviesList, movieCardClassName="film_card") {
    data.forEach(film=>{
        const filmCard = document.createElement(`div`);
        filmCard.classList.add(movieCardClassName);
        filmCard.setAttribute('data-filmid', `${film.kinopoiskId || film.filmId}`);

        movieOnClick(filmCard, apiKey);

        filmCard.innerHTML = `
            <div class="movie_img"><img src="${film.posterUrlPreview}" alt="${film.nameRu}"/></div>
            <div class="film_name">${film.nameRu}</div>
            <div class="film_genres">${film.genres[0]?.genre || '-'}</div>
        `;

        moviesList.appendChild(filmCard);
    });
}

function movieOnClick(filmCard, apiKey) {
    filmCard.addEventListener('click', e => {
        const filmId = filmCard.dataset.filmid;
        console.log(filmId);
        showModal(`movie`, apiKey, filmId);
    })
}

async function returnData(dataName, apiKey, url) {
    const localData = new LocalStorageData(dataName);
    const isCurrency = localData.isCurrency(localData.findInLocalStorage(dataName));
    let data = localData.findInLocalStorage(dataName);

    if(objIsEmpty(data) || !isCurrency) {
        data = await getFilmsFromApi(apiKey, url);
        localData.addToLocalStorage(data);
    } 
    
    return data;
}

export {showPremiers, showSearchResults, returnData};