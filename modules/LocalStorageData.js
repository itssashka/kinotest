import objIsEmpty from "./objIsEmpty.js";

export default class LocalStorageData {
    constructor(dataName) { //dataName = premiers/filmId
        this.dataName = dataName;
    }

    addToLocalStorage(data){
        const date = new Date();
        const newObj = data;

        newObj.saveDate = date;
        localStorage.setItem(this.dataName, JSON.stringify(newObj));
    }

    findInLocalStorage() {
        const localData = JSON.parse(localStorage.getItem(this.dataName));
        let returnedData = {};

        if(localData){
            returnedData = localData;
        }

        return returnedData;
    }

    isCurrency(data) {
        const currencyDate = new Date();
        const saveDate = new Date(data.saveDate);
        let returnedIsCurrency = true;

        if(objIsEmpty(data)) {
            return false
        }
        if ((currencyDate - saveDate) > 43200000) {
            returnedIsCurrency = false;
        } 
        
        return returnedIsCurrency;
    }
}