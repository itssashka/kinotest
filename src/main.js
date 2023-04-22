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
const APIkey = "d50f9193-d3d9-4bc0-9fa6-a803c9c1ec1b";
export {APIkey, monthArr};

const premiersUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${date.getFullYear()}&month=${monthArr[date.getMonth()]}`;



main();
logOutUser()

function main() {
    showPremiers(APIkey,premiersUrl);
    addSwiper(APIkey);
    addAdmin();
}

function logOutUser(){
    const user = new User();
    if (!user.isLogin()) {
        user.logOutUser();
    };
}

function addAdmin(){
    const user = new User('admin', '1', 'admin');
    user.addUser();
}

