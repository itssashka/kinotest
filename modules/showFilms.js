import getFilmsFromApi from "./getFilmsList.js"
import LocalStorageData from "./LocalStorageData.js"
import objIsEmpty from "./objIsEmpty.js";
import showModal from "../src/modal.js";

//вывод премьер
async function showPremiers(APIkey, url) {
    const data = await returnData(`premiers`, APIkey, url);
    const moviesList = document.querySelector('.films_list');
    moviesList.innerHTML = ``;
    showFilms(data.items, APIkey, moviesList, `film_card`);
}

//вывод результатов поиска
async function showSearchResults(APIkey, url, searchRequest) {
    const data = await returnData(`${searchRequest}`, APIkey, url);
    

    //очистка контейнера
    const mainContainer = document.querySelector('.main_container');
    mainContainer.innerHTML = `
        <div class="films_container dflex_column jcStart_aiStart">
            <h1 class="headers">Результаты поиска по запросу "${searchRequest}"</h1>
            <div class="films_list dflex_row jcStart_aiStart">
            </div>
            <div class="pagination_btn btns dflex_row jcCenter_aiCenter">Показать больше</div>
        </div>
    `;

    const paginationBtn = document.querySelector('.pagination_btn');
    const moviesList = document.querySelector('.films_list');    

    if(data.films.length > 0) {
        showFilms(data.films, APIkey, moviesList, `film_card`);
        paginationBtn.classList.remove('hidden');
    } else {        
        moviesList.innerHTML='Ничего не найдено';
        paginationBtn.classList.add('hidden');
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
            <div class="film_genres">${film.genres[0].genre}</div>
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

    console.log(isCurrency);

    if(objIsEmpty(data) || !isCurrency) {
        console.log('API');
        data = await getFilmsFromApi(apiKey, url);
        localData.addToLocalStorage(data);
    } 
    
    return data;
}

export {showPremiers, showSearchResults, returnData};