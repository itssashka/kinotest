import { APIkey } from "./main.js";
import { showSearchResults } from "../modules/showFilms.js";
import showModal from "./modal.js";

const searchForm = document.querySelector('.form_search');
const searchFiled = document.querySelector('.input_search');
const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`
const navSearchBottom = document.querySelector(`.nav_search_bottom`);

navSearchBottom.addEventListener(`click`, function(){
    showModal('search');
})

searchForm.addEventListener('submit', e=> {
    e.preventDefault();
    const searchRequest = searchFiled.value;
    const finalURL = `${url}${searchRequest}`;
    if(searchRequest.length > 0) {
        showSearchResults(APIkey, finalURL, searchRequest);
        // searchFiled.value="";
    }    
})

// показываем/убираем кнопку очистки 
searchFiled.addEventListener('input', e => {
    const clearBtn = document.querySelector(".btn_clear");
    if(searchFiled.value.length > 0) {
        clearBtn.classList.remove("hidden");
        clearBtn.addEventListener("click", e=>{
            searchFiled.value = "";
            clearBtn.classList.add('hidden');
        })
    } else {
        clearBtn.classList.add('hidden')
    }
})

export default function modalSearchEvents(){
    const searchFormModal = document.querySelector('.form_search_mod');
    const searchFiledModal = document.querySelector('.input_search_mod');
    const modalContent = document.querySelector('.modal_content'); 
    const modal = document.querySelector('.modal')  
    const body = document.querySelector('body')
    

    searchFormModal.addEventListener('submit', e => eventSubmit(e))
    
    // показываем/убираем кнопку очистки 
    searchFiledModal.addEventListener('input', eventClear)

    function eventSubmit(e) {
        e.preventDefault();
        console.log(`start search`);
        const searchRequest = searchFiledModal.value;
        const finalURL = `${url}${searchRequest}`;
        if(searchRequest.length > 0) {
            console.log(`search complete`);
            showSearchResults(APIkey, finalURL, searchRequest);
            modal.classList.remove('open')
            body.classList.remove('lock')
            modalContent.innerHTML='';
            // searchFiled.value="";
            searchFormModal.removeEventListener('submit', e => eventSubmit(e))
            searchFiledModal.removeEventListener('input', eventClear)
        }
    }

    function eventClear(){
        const clearBtn = document.querySelector(".btn_clear_mod");
        if(searchFiledModal.value.length > 0) {
            clearBtn.classList.remove("hidden");
            clearBtn.addEventListener("click", e=>{
                searchFiledModal.value = "";
                clearBtn.classList.add('hidden');
            })
        } else {
            clearBtn.classList.add('hidden')
        }
    }
}
