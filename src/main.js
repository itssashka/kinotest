import { showPremiers } from "../modules/showFilms.js";
import User from "../modules/User.js";
import addSwiper from "./Slider.js";

// формат даты
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
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
];


//ключ и ссылки API
const APIkey = "37a5b6ee-c8b2-4770-a156-7801d3dd5d89";
export {APIkey, monthArr};

const premiersUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${date.getFullYear()}&month=${monthArr[date.getMonth()]}`;



main();
logOutUser()

function main() {
    showPremiers(APIkey,premiersUrl);
    addSwiper(APIkey);
}

function logOutUser(){
    const user = new User();
    if (!user.isLogin()) {
        user.logOutUser();
    };
}

