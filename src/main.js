import { showPremiers } from "../modules/showFilms.js";
import User from "../modules/User.js";

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
    "NOVEMBER",
    "DECEMBER"
];


//ключ и ссылки API
const APIkey = "fd2e3646-d291-4baf-b188-5fe312515d9d";
export {APIkey};

const premiersUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${date.getFullYear()}&month=${monthArr[date.getMonth()]}`;



main();
logOutUser()

function main() {
    showPremiers(APIkey,premiersUrl);
}

function logOutUser(){
    const user = new User();
    if (!user.isLogin()) {
        user.logOutUser();
    };
}

