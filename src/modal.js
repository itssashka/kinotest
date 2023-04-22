import getFilmsFromApi from "../modules/getFilmsList.js";
import { eventLogin, eventReg, showUserName } from "./login.js";
import User from "../modules/User.js";
import { addComment, addCommentBlock, showComments } from "./showComments.js";
import modalSearchEvents from "./search.js";
import Favorite from "../modules/Favorite.js";
import throttle from "../modules/throttle.js";

const modal = document.querySelector('.modal'); // modal window
const btnCloseModal = document.querySelector('.btn_close_modal'); // close btn
const body = document.querySelector(`body`)

//закрытие модального окна
btnCloseModal.addEventListener('mousedown', e => {
    const modalContent = document.querySelector('.modal_content');   
    modal.classList.remove('open')
    body.classList.remove('lock')
    modalContent.innerHTML='';
});


export default function showModal(modalType, apiKey, filmId) {
    openModal();
    if (modalType === 'movie') {
        modalMovie(apiKey, filmId);        
    } else if (modalType === "login") {
        const user = new User();
        user.isLogin() ? modalAccount() : modalLogin();
    } else if (modalType === 'search') {
        modalSearch();
    }
}


async function modalMovie(apiKey, filmId) {
    const modalContent = document.querySelector('.modal_content');    
    modalContent.innerHTML = await returnFilmInfo(apiKey, filmId);
    modalContent.appendChild(addCommentBlock());  
    const user = new User();

    if (user.isLogin() && !isFilmInFavorite(filmId)) {await addToFavorite(apiKey, filmId)}
    else if (user.isLogin()) {modalRemoveFromeFavorite(apiKey,filmId)};
    
    const commentForm = document.querySelector('.add_comment_form');

    commentForm.addEventListener('submit', event => {
        event.preventDefault();
        const userName = user.isLogin() ? user.checkUser(user.currentUser()).userName : 'Гость';
        addComment(filmId, userName, user.currentUser())
    })

    showComments(filmId);
}



async function returnFilmInfo(apiKey, filmId) {
    const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
    const data = await getFilmsFromApi(apiKey, url); 
    const favorite = new Favorite();
    const returnedData = `
        <div class="modal_film dflex_row jcStart_aiStart">      
            <div class="dflex_column jcStart_aiStart">
                <div class="modal_img">
                    <div class="modal_film_rating dflex_row jcCenter_aiCenter">${data.ratingKinopoisk ? data.ratingKinopoisk : "-"}</div>
                    <img src="${data.posterUrlPreview}" alt="Film Poster">
                </div>
                ${favorite.isLogin() 
                    ? `<div class="add_to_favorite btns dflex_column jcCenter_aiCenter">
                        Добавить в избранное
                        </div>  
                        `
                    : ''
                }
                              
            </div>          
            
            <div class="modal_film_desc dflex_column jcStart_aiStart">
                <h1 class="modal_film_name headers">${data.nameRu || data.nameOriginal}</h1>            
                <div class="slogan">${data.slogan || '-'}</div>
                <div class="modal_film_about">${data.description || '-'}</div>
                <div class="modal_film_info dflex_column jcStart_aiStart">
                    <div class="info_row dflex_row">
                        <div class="info_title">Оригинальное название:</div>
                        <div class="info_value">${data.nameOriginal ? data.nameOriginal : "-"}</div>
                    </div>
                    <div class="info_row dflex_row">
                        <div class="info_title">Жанры:</div>
                        <div class="info_value">${data.genres.map(item => ` ${item.genre}`)}</div>
                    </div>
                    <div class="info_row dflex_row">
                        <div class="info_title">Год:</div>
                        <div class="info_value">${data.year}</div>
                    </div>
                    <div class="info_row dflex_row">
                        <div class="info_title">Страны</div>
                        <div class="info_value">${data.countries.map(item => ` ${item.country}`)}</div>
                    </div>
                    <div class="info_row dflex_row">
                        <div class="info_title">Длительность</div>
                        <div class="info_value">${data.filmLength}</div>
                    </div>
                    <div class="info_row dflex_row">
                        <div class="info_title">Рейтинг IMDB</div>
                        <div class="info_value">${data.ratingImdb || "-"}</div>
                    </div>
                    </div>
            </div>
        </div>

        <a href="https://www.kinopoisk.ru/${data.type === `TV_SERIES` ? "series" : "film"}/${filmId}/" target="_blank" class="modal_to_kinopisk_btn btns dflex_row jcCenter_aiCenter">Смотреть на кинопоиск</a>
        <div class="line"></div>       
    `

    return returnedData;
}

async function addToFavorite(apiKey, filmId){
    const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
    const addToFavoritebtn = document.querySelector('.add_to_favorite');
    addToFavoritebtn.innerHTML = `Добавить в избранное`;
    const favorite = new Favorite();
    const filmData = await getFilmsFromApi(apiKey, url);
    const throttledeventAddToFavorite = throttle(eventAddToFavorite, 1000);

    addToFavoritebtn.addEventListener('click', throttledeventAddToFavorite);

    function eventAddToFavorite() {
        favorite.addToFavorite(filmData);
        console.log("add");
        addToFavoritebtn.classList.add(`disable`)
        addToFavoritebtn.removeEventListener('click', throttledeventAddToFavorite);
        modalRemoveFromeFavorite(apiKey, filmId)
    }
}

function modalRemoveFromeFavorite(apiKey, filmId){
    const favorite = new Favorite();
    const addToFavoritebtn = document.querySelector('.add_to_favorite');
    addToFavoritebtn.classList.add('disable');
    addToFavoritebtn.innerHTML = `Убрать из избранного`;
    const throttledEventRemoveFromFavorite = throttle(eventRemoveFromFavorite, 1000);
    addToFavoritebtn.addEventListener('click', throttledEventRemoveFromFavorite);
    
    function eventRemoveFromFavorite(){
        favorite.removeFromFavorite(filmId);
        addToFavoritebtn.classList.remove('disable');
        console.log("remove");
        addToFavoritebtn.removeEventListener('click', throttledEventRemoveFromFavorite);
        addToFavorite(apiKey, filmId);
    }
}


function modalLogin() {
    const modalContent = document.querySelector('.modal_content');
   
    modalContent.innerHTML = `
        <div class="modal_authorization dflex_column jcCenter_aiCenter">
            <div class="headers">Вход</div>
            <form action="index.html" class="form_login dflex_column jcCenter_aiCenter">
                <input type="text" class="email_input form_account_item input" placeholder="Почта">
                <input type="password" class="login_pass form_account_item input" placeholder="Пароль">
                <p class="form_error_message"></p>
                <button class="form_submit_btn btns">Войти</button>
            </form>
            <div class="modal_btn_switch">Зарегистрироваться</div>
        </div>
    `;

    eventLogin();

    const btnSwitch = document.querySelector('.modal_btn_switch');
    btnSwitch.addEventListener('click', e=>{
        modalReg();
    })
}

function modalReg() {
    const modalContent = document.querySelector('.modal_content');
   
    modalContent.innerHTML = `
        <div class="modal_authorization dflex_column jcCenter_aiCenter">
            <div class="headers">Регистрация</div>
            <form action="index.html" class="form_login dflex_column jcCenter_aiCenter">
                <input type="text" class="login_input form_account_item input" placeholder="Логин">
                <input type="text" class="email_input form_account_item input" placeholder="Почта">
                <input type="password" class="login_pass form_account_item input" placeholder="Пароль">
                <input type="password" class="login_pass form_account_item input" placeholder="Повторите пароль">
                <p class="form_error_message"></p>
                <button class="form_submit_btn btns">Зарегистрироваться</button>
            </form>
            <div class="modal_btn_switch">Уже есть аккаунт?</div>
        </div>
    `;

    eventReg();

    const btnSwitch = document.querySelector('.modal_btn_switch');
    btnSwitch.addEventListener('click', e=>{
        modalLogin();
    })
}

function modalAccount() {
    const modalContent = document.querySelector('.modal_content');
    const user = new User();
    const currentUser = user.currentUser();
    const currentUserInfo =  user.checkUser(currentUser);

    modalContent.innerHTML = `
        <div class="modal_account dflex_column jcCenter_aiStart">
            <div class="block_header dflex_row jcSpBtw_aiCenter">
                <div class="headers">Личный кабинет</div>
                <div class="exit_btn btns dflex_row jcCenter_aiCenter">Выйти</div>
            </div>
            <div class="modal_user_info dflex_column jcStart_aiStart">
                <div class="dflex_row jcStart_aiStart">
                    <div class="account_user_title">Имя пользователя:</div>
                    <div class="account_user_inf">${currentUserInfo.userName}</div>
                </div>
                <div class="dflex_row jcStart_aiStart">
                    <div class="account_user_title">Почта:</div>
                    <div class="account_user_inf">${currentUserInfo.userEmail}</div>
                </div>
            </div>
            <div class="modal_favorite dflex_column jcStart_aiStart">
                <div class="green_txt">Понравившиеся фильмы:</div>
                <div class="fav_movies dflex_column jcStart_aiStart">

                </div>
            </div>
        </div>
    `;   

    const modalFavorite = document.querySelector('.fav_movies');
    accountFavoriteFilms(modalFavorite)
    
    const exitBtn = document.querySelector('.exit_btn');
    exitBtn.addEventListener('click', event => {
        user.logOutUser();
        showUserName()
        modalLogin();        
    })
}

function accountFavoriteFilms(modalFavorite) {
    const favorite = new Favorite();
    const favoriteFilms = favorite.getFavorites();
    modalFavorite.innerHTML = ``;

    if (favoriteFilms.length > 0) {
        favoriteFilms.forEach(film => {            
            if(film !== null) {
                const movie = document.createElement('div');
                movie.classList.add(`fav_movie`, `dflex_row`, `jcStart_aiStart`);
                movie.setAttribute('data-movie-id', film.filmKpId)
                movie.innerHTML = `
                    <div class="fav_movie_img">
                        <img src="${film.filmPoster}" alt="">
                    </div>
                    <div class="fav_movie_desc dflex_row jcSpBtw_aiCenter">
                        <div>${film.filmName}</div>
                        <div class="remove_from_favorite green_txt">Удалить</div>
                    </div>
                `
    
                modalFavorite.prepend(movie);
                removeFromFavoriteAccount(film.filmKpId,modalFavorite);
            }
        });
    }
    

    const movies = document.querySelectorAll(`.fav_movie`);
    if(movies.length === 0) {
        const favEmptyEll = document.createElement('div');
        favEmptyEll.innerHTML = 'Здесь пока пусто';
        modalFavorite.appendChild(favEmptyEll);
    }
}

function removeFromFavoriteAccount(filmId,modalFavorite){
    const favorite = new Favorite();
    const removeBtn = document.querySelector('.remove_from_favorite');
    removeBtn.addEventListener('click', e=>{
        favorite.removeFromFavorite(filmId);
        accountFavoriteFilms(modalFavorite);
    })
}

function modalSearch(){
    const modalContent = document.querySelector('.modal_content'); 
    modalContent.innerHTML = `
        <div class="modal_search_box dflex_row jcCenter_aiCenter form">
            <form action="#" class="form_search_mod dflex_row jcCenter_aiCenter">
                <input type="text" class="input_search_mod input dflex_row jcStart_aiCenter" placeholder="Поиск">
                <div class="btn_clear_mod hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg_clear">
                        <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/>
                    </svg>
                </div>
                <button type="submit" class="search_submit dflex_row jcCenter_aiCentet">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg_search">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </button>
            </form>
        </div>
    `
    modalSearchEvents();

}

function isFilmInFavorite(currentFilmId){
    const favorite = new Favorite();
    const favFilms = favorite.getFavorites();
    let isInFavorite = false;
    favFilms.forEach(film=>{
        if(!film) return
        if(film.filmKpId == currentFilmId) {
            isInFavorite = true;
        }
    })

    return isInFavorite;
}


// открытие модального окна
function openModal() {
    modal.classList.add('open');
    body.classList.add('lock')
}