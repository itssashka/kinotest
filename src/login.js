import showModal from "./modal.js";
import User from "../modules/User.js";
import objIsEmpty from "../modules/objIsEmpty.js";

export {eventLogin, eventReg, showUserName};

const btnAccount = document.querySelector('.login');
const errorMessages = {
    emptyFields: "Все поля должны быть заполнены",
    passNotMatch: "Пароли не совпадают",
    emailErr: "Пользователь с такой почтой уже зарегистрирован",
    wrongPass: "Неправильный логин или пароль",
    incorrectPass: "Пароль должен содержать заглавные и строчные буквы, хотябы одну цифру, специальные символы(!@#$%^&*!@#$%^&*.,\';:) и не содержать пробелов",
    incorrectEmail: "Неверный формат почты"
}

showUserName();

function showUserName(){
    const userLoginBtn = document.querySelector('.login');
    const user = new User();
    const currentUser = user.currentUser();
    const currentUserName = user.checkUser(currentUser).userName;
    const userIsLogin = user.isLogin();

    if(userIsLogin) {
        userLoginBtn.innerHTML = `<p>${currentUserName[0]}</p>`;
        userLoginBtn.classList.add('authorized');
    } else {
        userLoginBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="svg_user">
                <path d="M14.81,12.28a3.73,3.73,0,0,0,1-2.5,3.78,3.78,0,0,0-7.56,0,3.73,3.73,0,0,0,1,2.5A5.94,5.94,0,0,0,6,16.89a1,1,0,0,0,2,.22,4,4,0,0,1,7.94,0A1,1,0,0,0,17,18h.11a1,1,0,0,0,.88-1.1A5.94,5.94,0,0,0,14.81,12.28ZM12,11.56a1.78,1.78,0,1,1,1.78-1.78A1.78,1.78,0,0,1,12,11.56ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"/>
            </svg>
        `;
        userLoginBtn.classList.remove('authorized');
    }
}

btnAccount.addEventListener('click', e=>{
    e.preventDefault();
    showModal('login');
})

function inputDelErrors(){
    const inputs = document.querySelectorAll(`.form_account_item`);
    inputs.forEach(input => {
        input.addEventListener('input', e=>{
            e.preventDefault();
            e.target.classList.remove('error');
        })
    })
}


function eventLogin(){
    const form = document.querySelector('.form_login');
    const formError = document.querySelector('.form_error_message');
    const formInputs = document.querySelectorAll('.form_account_item');
    inputDelErrors()

    form.addEventListener('submit', event=>{
        if(checkEmptyFields(formInputs)) {
            showErrorMessages(event, formError, 'emptyFields');
        } else if(!loginUser()) {
            showErrorMessages(event, formError, 'wrongPass');
        }
    })
}

function loginUser(){
    const emailInput = document.querySelector('.email_input')
    const passInput = document.querySelector('.login_pass')

    const email = emailInput.value;
    const pass = passInput.value;

    const user = new User(email, pass)
    const userData = user.checkUser();
    let isPassMatch;

    if (!objIsEmpty(userData)) {
        console.log(`qwe`);
        if (pass === userData.userPass) {
            user.loginUser();
            showUserName()
            isPassMatch = true;
        } else isPassMatch = false;
    } else isPassMatch = false;

    if(!isPassMatch) {
        emailInput.classList.add('error');
        passInput.classList.add('error');
    }


    return isPassMatch;
}

function eventReg() {
    const form = document.querySelector('.form_login');
    const formError = document.querySelector('.form_error_message');
    const formInputs = document.querySelectorAll('.form_account_item');
    inputDelErrors();

    form.addEventListener('submit', event => {
        if(checkEmptyFields(formInputs)) {
            showErrorMessages(event, formError, 'emptyFields');
        }else if(!isPassMatch()){
            showErrorMessages(event, formError, 'passNotMatch');
        }else if(!passIsCorrect()) {
            showErrorMessages(event,formError, 'incorrectPass');
        }else if(!emailIsValid()){
            showErrorMessages(event, formError, 'incorrectEmail');
        }else if(!regUser()) {
            showErrorMessages(event, formError, 'emailErr');
        }
    });
}

function regUser(){
    const loginField = document.querySelector('.login_input');
    const emailField = document.querySelector('.email_input');
    const passField = document.querySelector('.login_pass');
    let isReged = false;

    const email = emailField.value;
    const login = loginField.value;
    const pass = passField.value;

    const user = new User(email, pass, login);
    const userInfo = user.checkUser();

    if(objIsEmpty(userInfo)){
        user.addUser();
        isReged = true;
    } else {
        emailField.classList.add('error')
    }

    return isReged;
}

function showErrorMessages(event,formError,errorMessage) {
    event.preventDefault();
    formError.innerHTML = errorMessages[errorMessage];
}

function checkEmptyFields(formInputs){
    const emptyFields = Array.from(formInputs).filter(input => input.value.length === 0);
    let isEmptyFields = false;

    formInputs.forEach(element => {
        if(element.value.length === 0) {
            console.log('err');
            element.classList.add('error');
        } else {
            element.classList.remove('error');
        }              
    })
    if(emptyFields.length !== 0) isEmptyFields = true;
        else isEmptyFields = false;  
    return isEmptyFields;
}

function isPassMatch(){
    const passInputs = document.querySelectorAll('.login_pass');
    let isMatch = false;
    
    if(passInputs[0].value === passInputs[1].value){
        isMatch = true;
    } else {
        passInputs[0].classList.add('error');
        passInputs[1].classList.add('error');
        isMatch = false;
    }

    return isMatch;
}

function passIsCorrect(){
    const passInputs = document.querySelectorAll('.login_pass');
    let passStr = 0;
    let isPassCorrect = false;

    if(/(?=.*[a-z])/.test(passInputs[0].value)) passStr++;
    if(/(?=.*[A-Z])/.test(passInputs[0].value)) passStr++;
    if(/\d/.test(passInputs[0].value)) passStr++;
    if(/(?=.*[!@#$%^&*.,';:])/.test(passInputs[0].value)) passStr++;
    if(passInputs[0].value.length > 8) passStr++;
    if(/\s/.test(passInputs[0].value)) passStr--;

    if(passStr === 5) isPassCorrect = true;
    else {
        passInputs[0].classList.add('error');
        passInputs[1].classList.add('error');
        isPassCorrect = false;
    }

    return isPassCorrect;
}

function emailIsValid(){
    const emailRegExp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const emailInput = document.querySelector('.email_input');
    if(!emailRegExp.test(emailInput.value)) emailInput.classList.add('error');
    return emailRegExp.test(emailInput.value);
}
